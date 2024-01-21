import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey, getUserByAccountKey } from '@/utils/getData';
import verifyToken from '@/functions/auth/veryifToken';
import database from '@/functions/utils/mysql';
import { isAdminAccount } from '../../auth';
import { AccomodationDatabase, SafeAccountDatabase, SafeUserDatabase, TicketDatabase } from '@/models/database.model';
import * as mysql from "mysql";
import { IAccomodationRaw } from '@/models/accomodation.model';
import handlebars from 'handlebars';
import { findTemplate, sendMail } from '@/functions/mail/mail-controller';
import { v4 as uuidv4 } from 'uuid';
import { IRoomRaw } from '@/models/room.model';


const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
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

    if (tokenPayload) {
        const account: IAccount | undefined = await getAccountByKey(tokenPayload.accountKey);
        if (account) {
            if (await isAdminAccount(account)) {
                const { id } = req.query
                if (!id) return sendResponse(400, {message: "No ID provided", e_code: 'admin_update_usr_1'})

                const getAccount = (userId: number) => {
                    return new Promise<any | undefined>(async (resolve) => {
                        const query = 
                        `
                        SELECT * FROM account WHERE account.id = ${userId}
                        `

                        database.query(query, async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_2"}); 
                                resolve(undefined);
                            }
                            resolve(result[0]);
                        });
                    }).catch(() => {
                        return undefined
                    });
                }

                const account = await getAccount(parseInt(id.toString()));
                let user: any = undefined
                if (account) user = await getUserByAccountKey(account.AccountKey)

                if (account != undefined && user != undefined) {
                    const result = new Promise<boolean>(async (mainResolve) => {
                        database.getConnection((err, connection) => {
                            if (err) {
                                sendResponse(500, { message: "Unknown Error", e_code: "admin_update_usr_3" });
                                mainResolve(false);
                            }
                            connection.beginTransaction(async (err) => {
            
                                if (err) {
                                    console.log("ERROR: ", err);
                                    connection.release();
                                    sendResponse(500, { message: "Error while creating the transaction.", e_code: "admin_update_usr_4" });
                                    mainResolve(false);
                                }
            
                                const rollback = (con: mysql.PoolConnection) => {
                                    con.rollback(() => {
                                        con.release();
                                    });
                                }

                                // EMAIL FLAGS
                                const emails = {
                                    verification: false,
                                    rejection: false,
                                    paymentConf: false,
                                    roomAssign: false,
                                }
                                // EMAIL FLAGS


                                const resolveAdminReassign = async () => {
                                    return new Promise<boolean>(async (resolve) => {
                                        const query = 
                                        `
                                        SELECT * FROM room WHERE adminKey = ?;
                                        `
                                        
                                        connection.query(query, [account.AccountKey], (err: any, room: any[]) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_5"});
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
                                                        sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_6"});
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
                                                sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_7"});
                                                resolve(false);
                                            }
                                        })
    
                                        connection.query(mysql.format(`UPDATE room SET ? WHERE id = ?`, [data, id]), (err: any) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_8"});
                                                resolve(false);
                                                return;
                                            }
                                            else {
                                                resolve(true);
                                            }
                                        });
                                    })
                                }
            


                                const updateData = async (data: any, table: string) => {
                                    return new Promise<boolean>(async (resolve) => {
                                        if (data.hasOwnProperty("registeredAt")) {
                                            data.registeredAt = toSqlDatetime(new Date(data.registeredAt.trim()));
                                        }
                                        if (data.hasOwnProperty("creationDate")) {
                                            data.creationDate = toSqlDatetime(new Date(data.creationDate.trim()));
                                        }
                                        Object.keys(data).forEach(k => {
                                            (typeof data[k] == 'string') ? (data[k] = data[k].trim()) : {};
                                        });
                                        connection.query(mysql.format(`UPDATE ${table} SET ? WHERE AccountKey = '${account.AccountKey}'`, [data]), async (err) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                sendResponse(500, { message: "Insertion Failed.", e_code: "admin_update_usr_9" });
                                                rollback(connection);
                                                resolve(false);
                                            } else {
                                                resolve(true);
                                            }
                                        });
                                    })
                                }
                                const deleteData = async (table: string) => {
                                    return new Promise<boolean>(async (resolve) => {
                                        connection.query(`DELETE FROM ${table} WHERE AccountKey = ?`, [account.accountKey], async (err) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                sendResponse(500, { message: "Deletion Failed.", e_code: "admin_update_usr_10" });
                                                rollback(connection);
                                                resolve(false);
                                            } else {
                                                if (table == 'accomodation') {
                                                    resolve(await resolveAdminReassign())
                                                }
                                                else resolve(true);
                                            }
                                        });
                                    })
                                }
                                const createNewAccomodation = (data: any) => {
                                    return new Promise<boolean>(async (resolve) => {
                                        const aKey = uuidv4()
                                        const newData = {
                                            roomId: data.roomId,
                                            AccountKey: account.AccountKey,
                                            AccomodationKey: aKey,
                                            creationDate: toSqlDatetime(new Date())
                                        }
    
                                        connection.query(mysql.format(`INSERT INTO accomodation (${Object.keys(newData).join(",")}) VALUES (?)`, [Object.values(newData)]), (err: any, res: { insertId: any; }) => {
                                            if (err) {
                                                console.log("ERROR: ", err);
                                                rollback(connection);
                                                sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_11"});
                                                resolve(false);
                                                return;
                                            }
                                            else {
                                                const query = 
                                                `
                                                SELECT * FROM room WHERE id = ?;
                                                `

                                                connection.query(query, [data.roomId],async (err: any, roomRes: IRoomRaw[]) => {
                                                    if (err) {
                                                        console.log("ERROR: ", err);
                                                        rollback(connection);
                                                        sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_12"});
                                                        resolve(false);
                                                        return;
                                                    }
                                                    else if (roomRes.length) {
                                                        const room = roomRes[0]
                                                        if (await updateData({AccomodationKey: aKey}, 'account')) {
                                                            if (room.adminKey) resolve(true);
                                                            else {
                                                                const newRoomData = {
                                                                    roomPin: null,
                                                                    customName: null,
                                                                    adminKey: account.AccountKey
                                                                }
                                                                resolve(await updateRoom(newRoomData, data.roomId))
                                                            }
                                                        }
                                                        else resolve (false)
                                                    }
                                                })
                                            }
                                        });
                                    })
                                }
                                


                                const createPayload = (data: any, template: any) => {
                                    if (data === null) return null
                                    else {
                                        let temp = template
                                        _.assign(temp , _.pick(data, _.keys(temp)));
                                        return JSON.parse(JSON.stringify(temp))
                                    }
                                }
                                const checkSuccess = async (data: any, table: string) => {
                                    // Account verification / rejection
                                    if (table == 'account' && data.hasOwnProperty('isVerified')) {
                                        if (data.isVerified == true) {
                                            emails.verification = true
                                        }
                                        else if (data.isVerified == -1) {
                                            data = null
                                            emails.rejection = true
                                        }
                                    }
                                    if (table == 'ticket' && data.hasOwnProperty('isPaid')) {
                                        if (data.isPaid == true) {
                                            emails.paymentConf = true
                                        }
                                    }
                                    
                                    if (table == 'accomodation' && !_.isEmpty(data) && !account.AccomodationKey) {
                                        emails.roomAssign = true
                                        const status = await createNewAccomodation(data)
                                        if (!status) mainResolve(false);
                                        return status
                                    }
                                    if (data === null) {
                                        const status = await deleteData(table)
                                        if (!status) mainResolve(false);
                                        return status
                                    }
                                    else if (!_.isEmpty(data)) {
                                        const status = await updateData(data, table);
                                        if (!status) mainResolve(false);
                                        return status
                                    }
                                    else return true
                                }
                                
                                const accountPayload = createPayload(req.body.account, new SafeAccountDatabase());
                                const userPayload = createPayload(req.body.user, new SafeUserDatabase());
                                const ticketPayload = createPayload(req.body.ticket, new TicketDatabase());
                                const accomodationPayload = createPayload(req.body.accomodation, new AccomodationDatabase());
                                
                                const accountInsertionState: boolean = await checkSuccess(accountPayload, 'account')
                                const userInsertionState: boolean = await checkSuccess(userPayload, 'user')
                                const ticketInsertionState: boolean = await checkSuccess(ticketPayload, 'ticket')
                                const accomodationInsertionState: boolean = await checkSuccess(accomodationPayload, 'accomodation')


                                if (userInsertionState && accountInsertionState && ticketInsertionState && accomodationInsertionState) {
                                    const getRoom = (id: string | number) => {
                                        return new Promise<undefined | IRoomRaw>(async (resolve) =>{
                                            const query = 
                                            `
                                            SELECT * FROM room WHERE id = ?
                                            LIMIT 1;
                                            `

                                            connection.query(query, [id], async (err: any, room: IRoomRaw[]) => {
                                                if (err) {
                                                    console.log("ERROR: ", err);
                                                    rollback(connection);
                                                    sendResponse(500, {message: "Unknown Error", e_code: "admin_update_usr_6"});
                                                    resolve(undefined);
                                                    return;
                                                }
                                                resolve(room[0])
                                            });
                                        })
                                    }
                                    
                                    let emailStatus = true;
                                    await Promise.all(Object.keys(emails).map(async (key) => {
                                        if (emails[key as keyof typeof emails]) {
                                            let props: any;
                                            let template: any;
                                            let replacements: any;
                                            switch (key) {
                                                case 'verification':
                                                    props = await findTemplate(account.nationality, 'regVerification')
                                                    if (props) {
                                                        template = handlebars.compile(props.mail);
                                                        replacements = {
                                                            fursonaName: user.fursonaName,
                                                            loginUrl: `${process.env.DOMAIN_ROOT}login`
                                                        };
                                                        props.mail = template(replacements);
                                                    } else emailStatus = false
                                                    break;
                                                case 'rejection':
                                                    props = await findTemplate(account.nationality, 'regRejection')
                                                    if (props) {
                                                        template = handlebars.compile(props.mail);
                                                        replacements = {
                                                            fursonaName: user.fursonaName,
                                                        };
                                                        props.mail = template(replacements);
                                                    } else emailStatus = false
                                                    break;
                                                case 'paymentConf':
                                                    props = await findTemplate(account.nationality, 'paymentConf')
                                                    if (props) {
                                                        template = handlebars.compile(props.mail);
                                                        replacements = {
                                                            fursonaName: user.fursonaName,
                                                            loginUrl: `${process.env.DOMAIN_ROOT}login`
                                                        };
                                                        props.mail = template(replacements);
                                                    } else emailStatus = false
                                                    break;
                                                case 'roomAssign':  
                                                    props = await findTemplate(account.nationality, 'roomAssign')
                                                    const room = await getRoom(accomodationPayload.roomId)
                                                    if (props && room) {
                                                        template = handlebars.compile(props.mail);
                                                        replacements = {
                                                            fursonaName: user.fursonaName,
                                                            roomData: `
                                                                ${room.building.charAt(0).toUpperCase() + room.building.slice(1)}<br/>
                                                                ${room.roomNumber}
                                                                ${room.customName? ` (<i>${room.customName}</i>)` : ''}
                                                                `
                                                        };
                                                        props.mail = template(replacements);
                                                    } else emailStatus = false
                                                    break;
                                                default:
                                                    break;
                                            }
                                            if (emailStatus) {
                                                await sendMail({...props!, address: account.email!}, (err: string, result: string) => {
                                                    if (err) {
                                                        sendResponse(500, {message: "Failed to send email.", e_code: "admin_update_usr_13"}); 
                                                        emailStatus = false
                                                    }
                                                })
                                            }
                                        }
                                    }));

                                    if (emailStatus) {
                                        connection.commit(function (err) {
                                            if (err) {
                                                console.log(err)
                                                connection.rollback(function () {
                                                    sendResponse(500, { message: "Error While Committing", e_code: "admin_update_usr_14" });
                                                    mainResolve(false);
                                                });
                                            } else {
                                                connection.release();
                                                mainResolve(true);
                                            }
                                        });
                                    } else {
                                        connection.rollback(function () {
                                            sendResponse(400, { message: "No Data Provided", e_code: "admin_update_usr_15" });
                                            mainResolve(false);
                                        });
                                    }
                                }
                                else {
                                    connection.rollback(function () {
                                        sendResponse(400, { message: "No Data Provided", e_code: "admin_update_usr_16" });
                                        mainResolve(false);
                                    });
                                }
                            });
                        });
                    });
  
                    if (await result) {
                        sendResponse(200, {message: "Updated"})
                    }
                }
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_update_usr_17'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_update_usr_18'})
        }
    } else return
}