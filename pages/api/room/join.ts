import { IRoomRaw } from '@/models/room.model';
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import { IJoinForm } from '@/models/join-form.model';
import { IAccomodationRaw } from '@/models/accomodation.model';
import * as mysql from "mysql";
import { AccomodationDatabase, RoomDatabase, TicketDatabase } from '@/models/database.model';
import _ from 'lodash';
import { getTicketByAccountKey } from '@/utils/getData';
import { beginDbTransaction, getDbConnection, getTodayInIsoFormat } from '@/functions/utils/databaseHelpers';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import { ITicket } from '@/models/newDbModels/ticket.model';
import { getTicketById } from '@/services/ticket/service.ticket.select';
import { IAccomodation } from '@/models/newDbModels/accomodation.model';
import { getAccomodationById, getAccomodationsByRoomId } from '@/services/accomodation/service.accomodation.select';
import { insertAccomodation } from '@/services/accomodation/service.accomodation.insert';
import { changeAttendeeAccomodationId } from '@/services/attendee/service.attendee.update';
import { getRoomById } from '@/services/room/service.room.select';
import { enterRoom, leaveRoom } from '@/services/accomodation/service.accomodation.update';

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

    console.log(req.body)
    console.log(isJoinForm(req.body))
    console.log(isValidForm(req.body))
    if (!isJoinForm(req.body) && !isValidForm(req.body)) {
        return sendResponse(400, { message: "Invalid form", e_code: "room_join_1" });
    }

    const attendee: IAttendee | undefined = await getAttendeeByAccountKey(tokenPayload.accountKey);

    if (attendee == undefined)
        return sendResponse(404, { message: "Attendee not found", e_code: "room_join_2" });

    if (attendee.ticketId == undefined)
        return sendResponse(400, { message: "Attendee does not have a ticket", e_code: "room_join_3" });

    const ticket: ITicket | undefined = await getTicketById(attendee.ticketId);

    let connection: mysql.PoolConnection | null = null;;

    try {
        connection = await getDbConnection();
        await beginDbTransaction(connection);

        if (attendee.accomodationId != undefined) {
            const oldAccomodation = await getAccomodationById(attendee.accomodationId, connection);
            if (oldAccomodation != undefined) {
                const leaveRoomResult = await leaveRoom(oldAccomodation, connection);
                if (leaveRoomResult == undefined) {
                    throw new DatabaseError(500, "Failed to leave room", "room_join_56");
                }
            }
        }
        const newAccomodationId = await CreateNewAccomodationForAttendee(connection);
        const changeAccomodationResult = await changeAttendeeAccomodationId(attendee, newAccomodationId, connection);
        if (!changeAccomodationResult) {
            throw new DatabaseError(500, "Failed to change accomodation ID for attendee", "room_join_57");
        }

        attendee.accomodationId = newAccomodationId;

        const accomodation = await getAccomodationById(attendee.accomodationId, connection);

        if (accomodation == undefined) {
            throw new DatabaseError(500, "Accomodation creation failed", "room_join_58");
        }

        const occupants = await getAccomodationsByRoomId(req.body.roomId);

        const room = await getRoomById(req.body.roomId);

        if (room == undefined) {
            throw new DatabaseError(500, "Invalid room ID", "room_join_59");
        }

        if (occupants != undefined) {
            if (occupants.length != req.body.roomCount) {
                throw new DatabaseError(409, "Data changed", "room_join_60");
            }

            if (occupants.find((o) => o.id == attendee.accomodationId)) {
                throw new DatabaseError(400, "Already joined", "room_join_61");
            }

            if (occupants.length >= room.size) {
                throw new DatabaseError(409, "Room full", "room_join_62");
            }
        }

        if (room.pin && room.pin != req.body.pin) {
            throw new DatabaseError(401, "Wrong pin", "room_join_63");
        }

        console.log('A')
        const result = await enterRoom(accomodation, req.body.roomId);
        console.log(result)
        if (result == undefined) {
            throw new DatabaseError(500, "Failed entering the room", "room_join_64");
        }

    } catch (err) {
        console.log(err)
        if (connection) {
            await new Promise<void>(resolve => connection!.rollback(() => {
                connection!.release();
                resolve();
            }));
        }

        if (err instanceof DatabaseError) {
            sendResponse(err.return_code, { message: err.message, e_code: err.e_code });
        } else {
            sendResponse(500, { message: `Unknown error occured: ${err}`, e_code: "room_join_99" });
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }

    sendResponse(201, { message: "Joined Room" });
}

async function CreateNewAccomodationForAttendee(connectionToUse: mysql.PoolConnection): Promise<number> {
    const accomodaton: IAccomodation = {
        isOwner: false
    };

    return await insertAccomodation(accomodaton, connectionToUse);
}