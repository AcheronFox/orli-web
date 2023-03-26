import { IRoom, IRoomStructure } from '@/models/room.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import { verifyScript } from '@/utils/veryifToken';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return

    const tokenPayload = await verifyScript(req.body.accessToken, res);
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        let response: IRoom[] = [];
        const query = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT * FROM room
                `

                database.query(query, async (err: any, result: IRoom[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "script_room_1"}); 
                        resolve(false);
                    }
                    response = result
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "script_room_2"}); 
            });
        }

        if (await query()) {
            const unique = Array.from(new Set(response.map(item => item.building)))
            
            let result: IRoomStructure = {}
            for (let i=0; i < unique.length; i++) {
                result[unique[i]] = response.filter((o) => o.building == unique[i])
            }

            sendResponse(200, result);
        }
    } else return
}