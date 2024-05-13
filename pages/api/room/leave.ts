// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import * as mysql from "mysql";
import _ from 'lodash';
import { getAccomodationById, getAccomodationsByRoomId } from '@/services/accomodation/service.accomodation.select';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import { leaveRoom } from '@/services/accomodation/service.accomodation.update';
import { beginDbTransaction, getDbConnection } from '@/functions/utils/databaseHelpers';


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

    if (!tokenPayload)
        return;

    if (!req.body.roomId || !req.body.roomCount) {
        return sendResponse(400, {message: "Missing prop", e_code: "room_leave_1"})
    }

    const roomId = req.body.roomId;
    const accountKey = tokenPayload.accountKey;
    const roomCount = req.body.roomCount;
    let connection: mysql.PoolConnection | null = null;

    try {
        connection = await getDbConnection();
        await beginDbTransaction(connection);

        let occupants = await getAccomodationsByRoomId(roomId, connection);

        const attendee = await getAttendeeByAccountKey(accountKey, connection);
        if (attendee == undefined) {
            sendResponse(400, { message: "Attendee with account key not found", e_code: "room_leave_2" });
            throw new Error("Attendee with account key not found")
        }

        if (!occupants) {
            sendResponse(400, { message: "No attendees in room", e_code: "room_leave_3" });
            throw new Error("No attendees in room")
        }

        if (!Array.isArray(occupants)) {
            occupants = [occupants]
        }
        
        if (occupants.length != roomCount) {
            sendResponse(409, { message: "Data changed", e_code: "room_leave_4" });
            throw new Error("Data changed")
        }
        if (!occupants.find((o) => o.id == attendee.accomodationId)) {
            sendResponse(400, { message: "User not in room", e_code: "room_leave_5" });
            throw new Error("User not in room")
        }
    
        if (attendee.accomodationId == undefined) {
            sendResponse(400, { message: "Attendee has no accomodation", e_code: "room_leave_6" });
            throw new Error("Attendee has no accomodation")
        }
    
        const accomodation = await getAccomodationById(attendee.accomodationId, connection);
    
        if (accomodation == undefined) {
            sendResponse(400, { message: "Can't find accomodation for attendee", e_code: "room_leave_7" });
            throw new Error("Can't find accomodation for attendee")
        }

        connection.commit()
    
        const result = await leaveRoom(accomodation, connection);
        if (result) {
            connection.commit()
            return sendResponse(201, {message: "Room left"});
        }
            

    } catch (err) {
        console.log(err)
        if (connection) {
            await new Promise<void>(resolve => connection!.rollback(() => {
                connection!.release();
                resolve();
            }));
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }

    // We should not get here at all.
    return sendResponse(500, { message: "Unknown error", e_code: "room_leave_9" });
}