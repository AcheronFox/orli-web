import { IRoomRaw } from '@/models/room.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/root/functions/utils/mysql'
import isMethodAllowed from '@/root/functions/auth/isMethodAllowed';
import verifyToken from '@/root/functions/auth/veryifToken';
import { IJoinForm } from '@/models/join-form.model';
import { IAccomodationRaw } from '@/models/accomodation.model';
import * as mysql from "mysql";
import { v4 as uuidv4 } from 'uuid';
import { AccomodationDatabase, RoomDatabase, TicketDatabase } from '@/models/database.model';
import _ from 'lodash';
import { getTicketByAccountKey } from '@/utils/getData';


const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffset
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return

    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const isJoinForm = (x: any): x is IJoinForm => {
        return typeof x.roomId === 'number';
    }

    const isValidForm = (x: IJoinForm) => {
        return x.roomId != undefined;
    }

    if (tokenPayload) {
        if (isJoinForm(req.body) && isValidForm(req.body)) {
            const ticket: TicketDatabase | undefined = await getTicketByAccountKey(tokenPayload.accountKey)
            const getRoom = async () => {
                return new Promise<undefined | IRoomRaw>(async (resolve) => {
                    const query = 
                    `
                    SELECT * FROM room WHERE id = ?;
                    `

                    database.query(query, [req.body.roomId], async (err: any, result: IRoomRaw[]) => {
                        if (err) {
                            console.log("ERROR: ", err);
                            sendResponse(500, {message: "Unknown Error", e_code: "room_join_1"}); 
                            resolve(undefined);
                        }
                        else if (result.length) { 
                            resolve(result[0]);
                        }
                        else {
                            sendResponse(400, {message: "Unknown room", e_code: "room_join_2"})
                            resolve(undefined);
                        }
                    });
                })
            }
            const getOccupants = async () => {
                return new Promise<undefined | IAccomodationRaw[]>(async (resolve) => {
                    const query = 
                    `
                    SELECT * FROM accomodation WHERE roomId = ?;
                    `

                    database.query(query, [req.body.roomId],async (err: any, result: IAccomodationRaw[]) => {
                        if (err) {
                            console.log("ERROR: ", err);
                            sendResponse(500, {message: "Unknown Error", e_code: "room_join_3"}); 
                            resolve(undefined);
                        }
                        resolve(result);
                    });
                })
            }

            if (!ticket || (ticket && ticket.ticketType !== '2')) {
                return sendResponse(401, {message: "Your selected ticket does not include a room.", e_code: "room_join_4"})
            }

            const room: IRoomRaw | undefined = await getRoom()
            let occupants: IAccomodationRaw[] | undefined = undefined
            if (room) occupants = await getOccupants()

            if (room && occupants != undefined) {
                if (occupants.length != req.body.roomCount) {
                    return sendResponse(409, {message: "Data changed", e_code: "room_join_5"})
                }
                if (room.roomPin && room.roomPin != req.body.pin) {
                    return sendResponse(401, {message: "Wrong pin", e_code: "room_join_6"})
                }
                if (occupants.find((o) => o.AccountKey == tokenPayload.accountKey)) {
                    return sendResponse(400, {message: "Already joined", e_code: "room_join_7"})
                }



                const runCreate = async () => {
                    return await new Promise<boolean>(async (mainResolve) => {
                        database.getConnection((err, connection) => {
                            if (err) {
                                sendResponse(500, { message: "Unknown Error", e_code: "room_join_7" });
                                mainResolve(false);
                            }
                            connection.beginTransaction(async (err) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    connection.release();
                                    sendResponse(500, { message: "Error while creating the transaction.", e_code: "room_join_8" });
                                    mainResolve(false);
                                }
                                const rollback = (con: mysql.PoolConnection) => {
                                    con.rollback(() => {
                                        con.release();
                                    });
                                }

                                const removeCurrentAccomodation = async () => {
                                    return new Promise<boolean>(async (resolve) => {
                                        const query = 
                                        `
                                        DELETE FROM accomodation WHERE AccountKey = ?;
                                        `

                                        connection.query(query, [tokenPayload.accountKey],(err: any) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_10"});
                                                resolve(false);
                                                return;
                                            }
                                            else {  
                                                resolve(true)
                                            }   
                                        });
                                    })
                                }

                                const resolveAdminReassign = async () => {
                                    return new Promise<boolean>(async (resolve) => {
                                        const query = 
                                        `
                                        SELECT * FROM room WHERE adminKey = ?;
                                        `

                                        connection.query(query, [tokenPayload.accountKey], (err: any, room: any[]) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_10"});
                                                resolve(false);
                                                return;
                                            }
                                            else if (room.length) {  
                                                const query = 
                                                `
                                                SELECT * FROM accomodation WHERE roomId = ? ORDER BY creationDate ASC;
                                                `

                                                connection.query(query, [room[0].id], async (err: any, accomodations: IAccomodationRaw[]) => {
                                                    if (err) {
                                                        console.log("ERROR: ", err);
                                                        rollback(connection);
                                                        sendResponse(500, {message: "Unknown Error", e_code: "room_join_10"});
                                                        resolve(false);
                                                        return;
                                                    }
                                                    else if (accomodations.length) {  
                                                        const payload = {
                                                            adminKey: accomodations[0].AccountKey
                                                        }
                                                        resolve(await updateRoom(payload, room[0].id))
                                                    }
                                                    else {
                                                        const defaultData = {
                                                            roomPin: null,
                                                            customName: null,
                                                            adminKey: null
                                                        }
                                                        resolve(await updateRoom(defaultData, room[0].id))
                                                    }
                                                });
                                            }
                                            else {
                                                resolve(true)
                                            }
                                        });
                                    })
                                }
                    
                                const createAccomodation = async (data: any) => {
                                    return new Promise<boolean>(async (resolve) => {
                                        Object.keys(data).forEach(k => {
                                            try {
                                                (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                            } catch {
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_9"});
                                                resolve(false);
                                            }
                                        })
        
                                        connection.query(mysql.format(`INSERT INTO accomodation (${Object.keys(data).join(",")}) VALUES (?)`, [Object.values(data)]), (err: any, res: { insertId: any; }) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_10"});
                                                resolve(false);
                                                return;
                                            }
                                            else {
                                                resolve(true)
                                            }
                                        });
                                    })
                                }
                    
                                const updateRoom = async (data: any, id: number) => {
                                    if (_.isEmpty(data)) return true
                                    return new Promise<boolean>(async (resolve) => {
                                        Object.keys(data).forEach(k => {
                                            try {
                                                (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                            } catch {
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_11"});
                                                resolve(false);
                                            }
                                        })

                                        connection.query(mysql.format(`UPDATE room SET ? WHERE id = ?;`, [data, id]), (err: any) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "room_join_12"});
                                                resolve(false);
                                                return;
                                            }
                                            else {
                                                resolve(true);
                                            }
                                        });
                                    })
                                }

                                const updateAccount = async (data: string) => {
                                    return new Promise<boolean>(async (resolve) => {
                                        
                                        connection.query(`UPDATE account SET AccomodationKey = ? WHERE AccountKey = ?;`, [data, tokenPayload.accountKey], (err: any) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "tcrt_8"});
                                                resolve(false);
                                                return;
                                            }
                                            else {
                                                resolve(true);
                                            }
                                        });
                                    }).catch(() => {
                                        rollback(connection);
                                        sendResponse(500, { message: "Unknown Error", e_code: "tcrt_9" });
                                        return false;
                                    });
                                }
    
                                const accomodationKey = uuidv4()
                                
                                let accomodationPayload = new AccomodationDatabase();
                                _.assign(accomodationPayload , _.pick(req.body, _.keys(accomodationPayload)));
                                accomodationPayload = JSON.parse(JSON.stringify(accomodationPayload))

                                const now = new Date()
                                accomodationPayload = {
                                    ...accomodationPayload,
                                    AccountKey: tokenPayload.accountKey,
                                    AccomodationKey: accomodationKey,
                                    creationDate: toSqlDatetime(now),
                                }


                                let roomPayload = new RoomDatabase();
                                roomPayload = {
                                    ...roomPayload,
                                    adminKey: room.adminKey? undefined : tokenPayload.accountKey,
                                    customName: room.adminKey? undefined : req.body.customName,
                                    roomPin: room.adminKey? undefined : req.body.pin,
                                }
                                roomPayload = JSON.parse(JSON.stringify(roomPayload))

                                
                                const accomodationDeletionState: boolean = await removeCurrentAccomodation();
                                if (!accomodationDeletionState) return;
                                const adminReassignState: boolean = await resolveAdminReassign();
                                if (!adminReassignState) return;


                                const accomodationInsertionState: boolean = await createAccomodation(accomodationPayload);
                                if (!accomodationInsertionState) return;
                                const roomUpdateState: boolean = await updateRoom(roomPayload, req.body.roomId);
                                if (!roomUpdateState) return;
                                const accountInertionState: boolean = await updateAccount(accomodationKey)
                                if (!accountInertionState) return;


                                if (accomodationInsertionState && roomUpdateState && accountInertionState) {
                                    connection.commit(async function (err) {
                                        if (err) {
                                            console.log(err)
                                            connection.rollback(function () {
                                                sendResponse(500, { message: "Error While Committing", e_code: "room_join_13" });
                                                mainResolve(false);
                                            });
                                        } else {
                                            connection.release();
                                            mainResolve(true);
                                        }
                                    });
                                }
                            });
                        });
                    });
                }



                const result = await runCreate();
                if (result) {
                    sendResponse(201, {message: "Joined Room"});
                }
            }
        }
        else {
            return sendResponse(400, {message: "Invalid form", e_code: "room_join_14"})
        }
    } else return
}