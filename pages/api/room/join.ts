import { IRoomRaw } from '@/models/room.model';
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import { IJoinForm } from '@/models/join-form.model';
import { IAccomodationRaw } from '@/models/accomodation.model';
import * as mysql from "mysql";
import { v4 as uuidv4 } from 'uuid';
import { AccomodationDatabase, RoomDatabase, TicketDatabase } from '@/models/database.model';
import _ from 'lodash';
import { getTicketByAccountKey } from '@/utils/getData';
import { getTodayInIsoFormat } from '@/functions/utils/databaseHelpers';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import { ITicket } from '@/models/newDbModels/ticket.model';
import { getTicketById } from '@/services/ticket/service.ticket.select';
import { IAccomodation } from '@/models/newDbModels/accomodation.model';
import { getAccomodationById, getAccomodationsByRoomId } from '@/services/accomodation/service.accomodation.select';
import { insertAccomodation } from '@/services/accomodation/service.accomodation.insert';
import { changeAttendeeAccomodationId } from '@/services/attendee/service.attendee.update';
import { getRoomById } from '@/services/room/service.room.select';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'GET')) {
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
        return sendResponse(404, { message: "Attendee not found", e_code: "room_join_2"});

    if (attendee.ticketId == undefined)
        return sendResponse(400, { message: "Attendee does not have a ticket", e_code: "room_join_3"});

    const ticket: ITicket | undefined = await getTicketById(attendee.ticketId);

    const newAccomodationId = await CreateNewAccomodationForAttendee();
    await changeAttendeeAccomodationId(attendee, newAccomodationId);
    attendee.accomodationId = newAccomodationId;

    const accomodation = await getAccomodationById(attendee.accomodationId);



    const occupants = await getAccomodationsByRoomId(req.body.roomId);

    const room = await getRoomById(req.body.roomId);

    if (room == undefined) {
        return sendResponse(500, { message: "Invalid room ID!", e_code: "room_join_4" });   
    }

    // if (occupants == undefined) {
    //     return sendResponse(500, { message: "Occupants came back empty even though they should not be!",
    //     e_code: "room_join_5"});
    // }
    
    if (occupants.length != req.body.roomCount) {
        return sendResponse(409, { message: "Data changed", e_code: "room_join_6" });
    }

    if (room.pin && room.pin != req.body.pin) {
        return sendResponse(401, { message: "Wrong pin", e_code: "room_join_7"});
    }

    if (occupants.find((o) => o.id == attendee.accomodationId)) {
        return sendResponse(400, { message: "Already joined", e_code: "room_join_8"});
    }

    if (occupants.length >= room.size) {
        return sendResponse(409, { message: "Room full", e_code: "room_join_9"});
    }



    
    
}

async function ExecuteJoinQueries()
{

}

async function CreateNewAccomodationForAttendee(): Promise<number>
{
    const accomodaton: IAccomodation = {
        isOwner: false
    };

    return await insertAccomodation(accomodaton);
}