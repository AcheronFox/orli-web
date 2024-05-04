// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import { IAccomodationRaw } from '@/models/accomodation.model';
import * as mysql from "mysql";
import _ from 'lodash';
import { getAccomodationById, getAccomodationsByRoomId } from '@/services/accomodation/service.accomodation.select';
import { getAttendeeByAccountKey, getAttendeeById } from '@/services/attendee/service.attendee.select';
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

        const occupants = await getAccomodationsByRoomId(roomId, connection);
        const attendee = await getAttendeeByAccountKey(accountKey, connection);
        if (attendee == undefined) {
            throw new DatabaseError(400, "Attendee with account key not found", "room_leave_2")
        }
    
        if (!occupants) {
            throw new DatabaseError(400, "No attendees in room", "room_leave_3");
        }
    
        if (occupants.length != roomCount) {
            throw new DatabaseError(409, "Data changed", "room_leave_4");
        }
        if (!occupants.find((o) => o.id == attendee.accomodationId)) {
            throw new DatabaseError(400, "User not in room", "room_leave_5");
        }
    
        if (attendee.accomodationId == undefined) {
            throw new DatabaseError(400, "Attendee has no accomodation", "room_leave_6");
        }
    
        const accomodation = await getAccomodationById(attendee.accomodationId, connection);
    
        if (accomodation == undefined) {
            throw new DatabaseError(400, "Can't find accomodation for attendee", "room_leave_7");
        }
    
        const result = await leaveRoom(accomodation, connection);
    
        if (result)
            return sendResponse(201, {message: "Room left"});

    } catch (err) {
        if (connection) {
            await new Promise<void>(resolve => connection!.rollback(() => {
                connection!.release();
                resolve();
            }));
        }

        if (err instanceof DatabaseError) {
            return sendResponse(err.return_code, { message: err.message, e_code: err.e_code });
        } else {
            return sendResponse(500, { message: `Unknown error occured: ${err}`, e_code: "room_leave_8" });
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }

    // We should not get here at all.
    return sendResponse(500, { message: "Unknown error", e_code: "room_leave_9" });
}