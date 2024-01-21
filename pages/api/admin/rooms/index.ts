import { IRoom, IRoomRaw, IRoomStructure } from '@/models/room.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return

    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        const query = async () => {
            return new Promise<IRoomRaw[] | undefined>(async (resolve) => {
                const query = 
                `
                SELECT r.*, COUNT(a.roomId) AS roomTotal, (r.size - COUNT(a.roomId)) as freeSpots
                FROM room AS r
                LEFT JOIN accomodation AS a ON r.id = a.roomId
                GROUP BY r.id
                HAVING roomTotal < r.size;
                `

                database.query(query, async (err: any, result: IRoomRaw[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "adm_room_1"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            }).catch(() => {
                return undefined
            });
        }

        const response: IRoomRaw[] | undefined = await query();
        if (response) {
            sendResponse(200, response);
        }
    } else return
}