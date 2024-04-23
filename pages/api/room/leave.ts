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
        return sendResponse(400, {message: "Missing prop", e_code: "room_leave_2"})
    }

    const occupants = await getAccomodationsByRoomId(req.body.roomId);
    const attendee = await getAttendeeByAccountKey(tokenPayload.accountKey);
    if (attendee == undefined) {
        return sendResponse(400, { message: "Attendee with account key not found", e_code: "room_leave_10"});
    }

    if (!occupants) {
        return sendResponse(400, { message: "No attendees in room", e_code: "room_leave_11"});
    }

    if (occupants.length != req.body.roomCount) {
        return sendResponse(409, {message: "Data changed", e_code: "room_leave_3"})
    }
    if (!occupants.find((o) => o.id == attendee.accomodationId)) {
        return sendResponse(400, {message: "User not in room", e_code: "room_leave_4"})
    }

    if (attendee.accomodationId == undefined) {
        return sendResponse(400, {message: "Attendee has no accomodation", e_code: "room_leave_12"});
    }

    const accomodation = await getAccomodationById(attendee.accomodationId);

    if (accomodation == undefined) {
        return sendResponse(400, { message: "Can't find accomodation for attendee", e_code: "room_leave_13"});
    }

    const result = await leaveRoom(accomodation);

    if (result)
        sendResponse(201, {message: "Room left"});
}