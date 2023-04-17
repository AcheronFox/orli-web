import { isProd, log } from ".daemon/daemon";
import { AccomodationDatabase } from "@/models/database.model";
import database from "./daemonMysql";
import * as mysql from "mysql";
import { IAccomodationRaw } from "@/models/accomodation.model";
import _ from "lodash";
import { IRoomRaw } from "@/models/room.model";

const runLeave = async (accountKey: string) => {
    return await new Promise<boolean>(async (mainResolve) => {
        database.getConnection((err, connection) => {
            if (err) {
                log(`Error: ${err}`);
                mainResolve(false);
            }
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.log("ERROR: ", err);
                    connection.release();
                    log(`Error: ${err}`);
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
                        DELETE FROM accomodation WHERE AccountKey = '${accountKey}'
                        `

                        connection.query(query, (err: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                rollback(connection);
                                log(`Error: ${err}`);
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
                        SELECT * FROM room WHERE adminKey = '${accountKey}'
                        `

                        connection.query(query, (err: any, room: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                rollback(connection);
                                log(`Error: ${err}`);
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
                                        log(`Error: ${err}`);
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
                                log(`Error: ${err}`);
                                resolve(false);
                            }
                        })

                        connection.query(mysql.format(`UPDATE room SET ? WHERE id = ${id}`, [data]), (err: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                rollback(connection);
                                log(`Error: ${err}`);
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
                                log(`Error: ${err}`);
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

const roomHoggingWatcher = async () => {
    const accomodationQuery = async () => {
        return new Promise<AccomodationDatabase[] | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM accomodation
            `

            database.query(query, async (err: any, result: AccomodationDatabase[]) => {
                if (err) {
                    log(`Error: ${err}`);
                    resolve(undefined);
                }
                resolve(result);
            });
        });
    }
    const roomQuery = async () => {
        return new Promise<IRoomRaw[] | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM room
            `

            database.query(query, async (err: any, result: IRoomRaw[]) => {
                if (err) {
                    log(`Error: ${err}`);
                    resolve(undefined);
                }
                resolve(result);
            });
        });
    }
    
    const accomodations: AccomodationDatabase[] | undefined = await accomodationQuery()
    const rooms: IRoomRaw[] | undefined = await roomQuery()
    const currentDate = new Date()
    let isError: boolean = false

    if (accomodations != undefined && accomodations.length && rooms != undefined && rooms.length) {
        let removedCount = 0;

        for (let i=0; i < rooms.length; i++) {
            if (isError) continue
            const roomAccomodations = accomodations.filter((o) => o.roomId == rooms[i].id)
            if (!roomAccomodations.length) continue

            for (let j=0; j < roomAccomodations.length; j++) {
                if (!isError && accomodations[i]) {
                    const accomodationDate = new Date(roomAccomodations[j].creationDate!)
                
                    if (((accomodationDate.getTime() + (1000 * 60 * 60 * 24 * 3)) <= currentDate.getTime() &&
                        roomAccomodations.length == 1)) {
                        const removalStatus = await runLeave(roomAccomodations[j].AccountKey!)
                        if (!removalStatus) isError = true
                        else removedCount++
                    }
                }
            }
        }

        if (!isError && !isProd) {
            log(`${removedCount? removedCount : 'No'} accomodations have been removed.`)
        }
    }
    else {
        return;
    }
}

export default roomHoggingWatcher;