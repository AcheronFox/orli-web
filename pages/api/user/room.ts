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
        const query = async () => {
            return new Promise<undefined | IRoomRaw>(async (resolve) => {
                const query = 
                `
                SELECT room.id, room.building, room.roomNumber, room.size, room.customName, room.roomPin FROM room
                LEFT OUTER JOIN accomodation ON accomodation.roomId = room.id
                WHERE accomodation.AccountKey = '${tokenPayload.accountKey}'
                LIMIT 1
                `

                database.query(query, async (err: any, result: IRoomRaw[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "room_1"}); 
                        resolve(undefined);
                    }
                    resolve(result[0])
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "room_2"}); 
                return undefined
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
                WHERE accomodation.roomId = ${id}
                `

                database.query(query, async (err: any, result: {count: number}[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "room_1"}); 
                        resolve(undefined);
                    }
                    resolve(result[0].count)
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "room_2"}); 
                return undefined
            });
        }

        const response: IRoomRaw | undefined = await query()
        if (!response) return;
        const count: number | undefined = await getCount(response.id)

        if (response && count != undefined) {
            const transformData = (data: IRoomRaw) => {
                const hasPin = data.roomPin ? true : false
                return {...data, hasRoomPin: hasPin, roomPin: undefined, adminKey: undefined, occupantCount: count}
            }
            const finalData: IRoom = transformData(response)

            sendResponse(200, finalData);
        }
    } else return
}