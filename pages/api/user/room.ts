import { IRoom, IRoomRaw } from '@/models/room.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';

/*
FIX THIS SHIT

*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        if (code == 204) {
            res.status(code).send('')
            return;
        }
        res.status(code).json(data);
    }

    if (!tokenPayload)
        return;

    const query = async () => {
        return new Promise<undefined | IRoomRaw>(async (resolve) => {
            const query = 
            `
            SELECT 
                room.id,
                room.building,
                room.number AS roomNumber,
                room.size,
                room.customName,
                room.pin AS roomPin
            FROM
                room
                    LEFT OUTER JOIN
                accomodation ON accomodation.roomId = room.id
                    LEFT JOIN
                attendee ON attendee.accomodationId = accomodation.id
            WHERE
                attendee.accountKey = ?
            LIMIT 1;
            `;

            database.query(query, [tokenPayload.accountKey],async (err: any, result: IRoomRaw[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "u_room_1"}); 
                    resolve(undefined);
                }
                resolve(result[0]);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "u_room_2"}); 
            return undefined;
        });
    }

    const getCount = async (id: number) => {
        return new Promise<undefined | number>(async (resolve) => {
            const query = 
            `
            SELECT
            COUNT(accomodation.roomId)
            AS count
            FROM accomodation
            WHERE accomodation.roomId = ?;
            `;

            database.query(query, [id], async (err: any, result: {count: number}[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "u_room_3"}); 
                    resolve(undefined);
                }
                resolve(result[0].count);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "u_room_4"}); 
            return undefined;
        });
    }

    const response: IRoomRaw | undefined = await query();
    let count: number | undefined = undefined;
    if (response) count = await getCount(response.id);

    if (response && count != undefined) {
        const transformData = (data: IRoomRaw) => {
            const hasPin = !!data.roomPin;
            return {...data, hasRoomPin: hasPin, roomPin: undefined, adminKey: undefined, occupantCount: count};
        }
        const finalData: IRoom = transformData(response);

        sendResponse(200, finalData);
    }
    else sendResponse(204);
}