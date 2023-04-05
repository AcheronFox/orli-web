// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import verifyToken from '@/utils/veryifToken';
import { IAccomodationRaw } from '@/models/accomodation.model';
import * as mysql from "mysql";
import _ from 'lodash';


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

    if (tokenPayload) {
        const getOccupants = async () => {
            return new Promise<undefined | IAccomodationRaw[]>(async (resolve) => {
                const query = 
                `
                SELECT * FROM accomodation WHERE roomId = ${req.body.roomId}
                `

                database.query(query, async (err: any, result: IAccomodationRaw[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "room_leave_1"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            })
        }

        if (!req.body.roomId || !req.body.roomCount) {
            return sendResponse(400, {message: "Missing prop", e_code: "room_leave_2"})
        }

        const occupants: IAccomodationRaw[] | undefined = await getOccupants()
        if (occupants) {
            if (occupants.length != req.body.roomCount) {
                return sendResponse(409, {message: "Data changed", e_code: "room_leave_3"})
            }
            if (!occupants.find((o) => o.AccountKey == tokenPayload.accountKey)) {
                return sendResponse(400, {message: "User not in room", e_code: "room_leave_4"})
            }

            const runCreate = async () => {
                return await new Promise<boolean>(async (mainResolve) => {
                    database.getConnection((err, connection) => {
                        if (err) {
                            sendResponse(500, { message: "Unknown Error", e_code: "room_leave_5" });
                            mainResolve(false);
                        }
                        connection.beginTransaction(async (err) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                connection.release();
                                sendResponse(500, { message: "Error while creating the transaction.", e_code: "room_leave_6" });
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
                                    DELETE FROM accomodation WHERE AccountKey = '${tokenPayload.accountKey}'
                                    `

                                    connection.query(query, (err: any) => {
                                        if (err) {
                                            console.log("ERROR: ", err);
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "room_leave_7"});
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
                                    SELECT * FROM room WHERE adminKey = '${tokenPayload.accountKey}'
                                    `

                                    connection.query(query, (err: any, room: any[]) => {
                                        if (err) {
                                            console.log("ERROR: ", err);
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "room_leave_8"});
                                            resolve(false);
                                            return;
                                        }
                                        else if (room.length) {  
                                            const query = 
                                            `
                                            SELECT * FROM accomodation WHERE roomId = ${room[0].id} ORDER BY creationDate ASC
                                            `

                                            connection.query(query, async (err: any, accomodations: IAccomodationRaw[]) => {
                                                if (err) {
                                                    console.log("ERROR: ", err);
                                                    rollback(connection);
                                                    sendResponse(500, {message: "Unknown Error", e_code: "room_leave_9"});
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
                
                            const updateRoom = async (data: any, id: number) => {
                                if (_.isEmpty(data)) return true
                                return new Promise<boolean>(async (resolve) => {
                                    Object.keys(data).forEach(k => {
                                        try {
                                            (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                        } catch {
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "room_leave_10"});
                                            resolve(false);
                                        }
                                    })

                                    connection.query(mysql.format(`UPDATE room SET ? WHERE id = ${id}`, [data]), (err: any) => {
                                        if (err) {
                                            console.log("ERROR: ", err);
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "room_leave_11"});
                                            resolve(false);
                                            return;
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                })
                            }
                            
                            const accomodationDeletionState: boolean = await removeCurrentAccomodation();
                            if (!accomodationDeletionState) return;
                            const adminReassignState: boolean = await resolveAdminReassign();
                            if (!adminReassignState) return;

                            if (adminReassignState && accomodationDeletionState) {
                                connection.commit(async function (err) {
                                    if (err) {
                                        console.log(err)
                                        connection.rollback(function () {
                                            sendResponse(500, { message: "Error While Committing", e_code: "room_leave_12" });
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
                sendResponse(201, {message: "Room left"});
            }
        }
    } else return;
}