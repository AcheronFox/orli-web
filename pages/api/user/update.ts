import { generateCookies } from '@/utils/token-handler';
import * as mysql from "mysql";
import database from '@/utils/mysql';
import verifyToken from '@/utils/veryifToken'
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from "@/utils/isMethodAllowed";
import { SafeAccountDatabase, SafeUserDatabase } from "@/models/database.model";
import _ from 'lodash';
import resetPassword from "@/utils/password-handler";

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
    const isAllowed = await isMethodAllowed(req, res, 'PUT')
    if (!isAllowed) return;
    
    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        if (!req.body) {
            sendResponse(400, {message: "Missing data."});
            return;
        }
        const result = new Promise<boolean>(async (mainResolve) => {
            database.getConnection((err, connection) => {
                if (err) {
                    sendResponse(500, { message: "Unknown Error", e_code: "upd_1" });
                    mainResolve(false);
                }
                connection.beginTransaction(async (err) => {

                    if (err) {
                        console.log("ERROR: ", err);
                        connection.release();
                        sendResponse(500, { message: "Error while creating the transaction.", e_code: "upd_2" });
                        mainResolve(false);
                    }

                    const rollback = (con: mysql.PoolConnection) => {
                        con.rollback(() => {
                            con.release();
                        });
                    }

                    const updateUserData = async (data: any) => {
                        return new Promise<boolean>(async (resolve) => {
                            if (data.hasOwnProperty("registeredAt")) {
                                data.registeredAt = toSqlDatetime(new Date(data.registeredAt.trim()));
                            }
                            Object.keys(data).forEach(k => {
                                (typeof data[k] == 'string') ? (data[k] = data[k].trim()) : {};
                            });
                            connection.query(mysql.format(`UPDATE user SET ? WHERE AccountKey = ?`, [data, tokenPayload.accountKey]), async (err) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    sendResponse(500, { message: "Insertion Failed.", e_code: "upd_3" });
                                    rollback(connection);
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        }).catch(() => {
                            rollback(connection);
                            sendResponse(500, { message: "Unknown Error", e_code: "upd_4" });
                            return false;
                        });
                    }

                    const updateAccountData = async (data: any) => {
                        return new Promise<boolean>(async (resolve) => {
                            if (data.hasOwnProperty("dateOfBirth")) {
                                data.dateOfBirth = toSqlDatetime(new Date(data.dateOfBirth.trim()));
                            }
                            Object.keys(data).forEach(k => {
                                (typeof data[k] == 'string') ? (data[k] = data[k].trim()) : {};
                            });
                            connection.query(mysql.format(`UPDATE account SET ? WHERE AccountKey = ?`, [data, tokenPayload.accountKey]), async (err) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    sendResponse(500, { message: "Insertion Failed.", e_code: "upd_5" });
                                    rollback(connection);
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        }).catch(() => {
                            rollback(connection);
                            sendResponse(500, { message: "Unknown Error", e_code: "upd_6" });
                            return false;
                        });
                    }

                    
                    let accountPayload = new SafeAccountDatabase();
                    _.assign(accountPayload , _.pick(req.body, _.keys(accountPayload)));
                    accountPayload = JSON.parse(JSON.stringify(accountPayload))

                    let userPayload = new SafeUserDatabase();
                    _.assign(userPayload , _.pick(req.body, _.keys(userPayload)));
                    userPayload = JSON.parse(JSON.stringify(userPayload))


                    // HANDLE PASSWORD UPDATE
                    if (accountPayload.password) {
                        const result = await resetPassword(req.body.password, tokenPayload.accountKey)
                        if (!result?.success) {
                            connection.rollback(function () {
                                sendResponse(500, { message: "Error Reseting Password", e_code: "upd_7" });
                                mainResolve(false);
                            });
                            return;
                        } else {
                            const key = result.success
                            res.setHeader('Set-Cookie',
                                generateCookies("AUTO", key, req.cookies)
                                )
                        }
                    }


                    let userInsertionState: boolean = false;
                    let accountInsertionState: boolean = false;
                    if (!_.isEmpty(userPayload)) {
                        userInsertionState = await updateUserData(userPayload);
                        if (userInsertionState == false) return mainResolve(false);
                    }
                    if (!_.isEmpty(accountPayload)) {
                        accountInsertionState = await updateAccountData(accountPayload);
                        if (accountInsertionState == false) return mainResolve(false);
                    }

                    if ((!_.isEmpty(userPayload) && userInsertionState) ||
                        (!_.isEmpty(accountPayload) && accountInsertionState) ||
                        ((!_.isEmpty(userPayload) && userInsertionState) && (!_.isEmpty(accountPayload) && accountInsertionState))) {
                            connection.commit(function (err) {
                                if (err) {
                                    console.log(err)
                                    connection.rollback(function () {
                                        sendResponse(500, { message: "Error While Committing", e_code: "upd_8" });
                                        mainResolve(false);
                                    });
                                } else {
                                    connection.release();
                                    mainResolve(true);
                                }
                            });
                        }
                    else {
                        connection.rollback(function () {
                            sendResponse(400, { message: "No Data Provided", e_code: "upd_9" });
                            mainResolve(false);
                        });
                    }
                });
            });
        });
        if (await result) {
            sendResponse(200, {message: "Updated"})
        }
    } else return;
}