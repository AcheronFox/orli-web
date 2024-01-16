import { IRoom, IRoomRaw, IRoomStructure } from '@/models/room.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import verifyToken from '@/utils/veryifToken';


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
        let response: IRoomRaw[] = [];
        const query = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT id, building, roomNumber, size, customName, roomPin FROM room
                `

                database.query(query, async (err: any, result: IRoomRaw[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "room_1"}); 
                        resolve(false);
                    }
                    response = result
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "room_2"}); 
            });
        }

        if (await query()) {
            let finalData: IRoom[] = response.map((item) => {
                const hasPin = !!item.roomPin
                return {...item, hasRoomPin: hasPin, roomPin: undefined, adminKey: undefined}
            })

            const unique = Array.from(new Set(finalData.map(item => item.building)))
            
            let result: IRoomStructure = {}
            for (let i=0; i < unique.length; i++) {
                result[unique[i]] = finalData.filter((o) => o.building == unique[i])
            }

            sendResponse(200, result);
        }
    } else return
}