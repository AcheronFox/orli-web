import { IOccupant, IOccupantRaw } from '@/models/occupant.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import { IRoom } from '@/models/room.model';


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

    if (!tokenPayload)
        return;

    if (tokenPayload) {
        let response: IOccupantRaw[] = [];
        const query = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT 
                    fursona.name,
                    fursona.species,
                    fursona.hasFursuit,
                    fursona.pathToPictureFile,
                    fursona.id,
                    accomodation.ownerContact,
                    accomodation.roomId,
                    ticket.sponsorLevel,
                    attendee.registeredAt,
                    attendee.accountKey
                FROM
                    attendee
                        LEFT JOIN
                    accomodation ON attendee.accomodationId = accomodation.id
                        LEFT JOIN
                    room ON room.id = accomodation.roomId
                        LEFT JOIN
                    ticket ON attendee.ticketId = ticket.id
                        LEFT JOIN
                    fursona ON attendee.fursonaId = fursona.id
                WHERE
                    accomodation.roomId IS NOT NULL;
                `

                database.query(query, async (err: any, result: IOccupantRaw[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "occu_1"}); 
                        resolve(false);
                    }
                    response = result
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "occu_2"});
                return false
            });
        }

        let rooms: IRoom[] = []
        const getRooms = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT * FROM room;
                `

                database.query(query, async (err: any, result: IRoom[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "occu_3"}); 
                        resolve(false);
                    }
                    rooms = result
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "occu_4"});
                return false
            });
        }
        

        if (await query() && await getRooms()) {
            let result: IOccupant[] = response.map((item) => {
                const isAdmin = !!item.adminKey
                return {...item, isRoomAdmin: isAdmin, adminKey: undefined}
            })

            const tempArr: IOccupant[] = [...result]
            for (let i=0; i < rooms.length; i++) {
                const roomSize = rooms[i].size

                for (let j=0; j < roomSize; j++) {
                    if (tempArr.filter((o) => o.roomId == rooms[i].id).length < roomSize) {
                        tempArr.push({
                            fursonaName: '',
                            isRoomAdmin: false,
                            roomId: rooms[i].id,
                            fursonaSpecies: '',
                            picture: '',
                            isFursuiter: false,
                            sponsorLevel: '0',
                            registeredAt: '',
                            AccountKey: '',
                        })
                    }
                }
            }

            result = [...tempArr]
            sendResponse(200, result);
        }
    } else return
}