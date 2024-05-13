import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import { IJoinForm } from '@/models/join-form.model';
import * as mysql from "mysql";
import _ from 'lodash';
import { beginDbTransaction, getDbConnection } from '@/functions/utils/databaseHelpers';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import { IAccomodation } from '@/models/newDbModels/accomodation.model';
import { getAccomodationById, getAccomodationsByRoomId } from '@/services/accomodation/service.accomodation.select';
import { insertAccomodation } from '@/services/accomodation/service.accomodation.insert';
import { changeAttendeeAccomodationId } from '@/services/attendee/service.attendee.update';
import { getRoomById } from '@/services/room/service.room.select';
import { enterRoom, leaveRoom } from '@/services/accomodation/service.accomodation.update';
import { setCustomName, setPin } from '@/services/room/service.room.update';
import { IRoom } from '@/models/newDbModels/room.model';
import { getTicketById } from '@/services/ticket/service.ticket.select';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'POST')) {
        return;
    }

    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data);
    }

    const isJoinForm = (x: any): x is IJoinForm => {
        return typeof x.roomId === 'number';
    }

    const isValidForm = (x: IJoinForm) => {
        return x.roomId != undefined;
    }

    if (!tokenPayload)
        return;

    if (!isJoinForm(req.body) && !isValidForm(req.body)) {
        return sendResponse(400, { message: "Invalid form", e_code: "room_join_1" });
    }

    const attendee: IAttendee | undefined = await getAttendeeByAccountKey(tokenPayload.accountKey);

    if (attendee == undefined)
        return sendResponse(404, { message: "Attendee not found", e_code: "room_join_2" });

    if (attendee.ticketId == undefined)
        return sendResponse(400, { message: "Attendee does not have a ticket", e_code: "room_join_3" });

    const ticket = await getTicketById(attendee.ticketId)

    if (ticket?.type != "WACC")
        return sendResponse(400, { message: "Attendee does not have a valid ticket", e_code: "room_join_30" });

    let connection: mysql.PoolConnection | null = null;;

    try {
        connection = await getDbConnection();
        await beginDbTransaction(connection);

        if (attendee.accomodationId != undefined) {
            const oldAccomodation = await getAccomodationById(attendee.accomodationId, connection);
            if (oldAccomodation != undefined) {
                const leaveRoomResult = await leaveRoom(oldAccomodation, connection);
                if (leaveRoomResult == undefined) {
                    sendResponse(500, { message: "Failed to leave room", e_code: "room_join_56" });
                    throw new Error("Failed to leave room")
                }
            }
        }

        const room = await getRoomById(req.body.roomId);

        if (room == undefined) {
            sendResponse(500, { message: "Invalid room ID", e_code: "room_join_59" });
            throw new Error("Invalid room ID")
        }

        if (room.pin && room.pin != req.body.pin) {
            sendResponse(401, { message: "Wrong pin", e_code: "room_join_63" });
            throw new Error("Wrong pin")
        }

        let occupants = await getAccomodationsByRoomId(req.body.roomId);

        if (occupants != undefined) {
            if (!Array.isArray(occupants)) {
                occupants = [occupants]
            }

            if (occupants.length != req.body.roomCount) {
                sendResponse(409, { message: "Data changed", e_code: "room_join_60" });
                throw new Error("Data changed")
            }

            if (occupants.find((o) => o.id == attendee.accomodationId)) {
                sendResponse(400, { message: "Already joined", e_code: "room_join_61" });
                throw new Error("Already joined")
            }

            if (occupants.length >= room.size) {
                sendResponse(409, { message: "Room full", e_code: "room_join_62" });
                throw new Error("Room full")
            }
        }

        const newAccomodationId = await CreateNewAccomodationForAttendee(room, req.body, connection);
        const changeAccomodationResult = await changeAttendeeAccomodationId(attendee, newAccomodationId, connection);
        if (!changeAccomodationResult) {
            sendResponse(500, { message: "Failed to change accomodation ID for attendee", e_code: "room_join_57" });
            throw new Error("Failed to change accomodation ID for attendee")
        }

        connection.commit()

        attendee.accomodationId = newAccomodationId;

        const accomodation = await getAccomodationById(attendee.accomodationId, connection);

        if (accomodation == undefined) {
            sendResponse(500, { message: "Accomodation creation failed", e_code: "room_join_58" });
            throw new Error("Accomodation creation failed")
        }
        
        const result = await enterRoom(accomodation, req.body.roomId);

        if (result == undefined) {
            sendResponse(500, { message: "Failed entering the room", e_code: "room_join_64" });
            throw new Error("")
        }

    } catch (err) {
        console.log(err)
        if (connection) {
            await new Promise<void>(resolve => connection!.rollback(() => {
                resolve();
            }));
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }

    sendResponse(201, { message: "Joined Room" });
}

async function CreateNewAccomodationForAttendee(room: IRoom, data: IJoinForm, connectionToUse: mysql.PoolConnection): Promise<number> {
    let occupants = await getAccomodationsByRoomId(room.id!)
    let isOwner = false;

    if (occupants && !Array.isArray(occupants)) {
        occupants = [occupants]
    }
    if (!occupants?.length) {
        isOwner = true

        if (data.customName) await setCustomName(room.id!, data.customName, undefined, connectionToUse)
        if (data.pin) await setPin(room.id!, parseInt(data.pin), undefined, connectionToUse)
    }

    const accomodaton: IAccomodation = {
        isOwner: isOwner,
        ownerContact: data.telegram
    };

    return await insertAccomodation(accomodaton, connectionToUse);
}