import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';
import verifyToken from '@/utils/veryifToken';
import { isAdminAccount } from '../auth';
import database from '@/utils/mysql';


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
        const account: IAccount | undefined = await getAccountByKey(tokenPayload.accountKey);
        if (account) {
            if (await isAdminAccount(account)) {
                const { id } = req.query
                if (!id) return sendResponse(400, {message: "No ID provided", e_code: 'admin_search_usr_1'})

                const getAccount = (userId: number) => {
                    return new Promise<any | undefined>(async (resolve) => {
                        const query = 
                        `
                        SELECT * FROM account WHERE account.id = ?;
                        `

                        database.query(query, [userId], async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_2"}); 
                                resolve(undefined);
                            }
                            if (result.length) {
                                resolve(result[0]);
                            }
                            else {
                                sendResponse(404, {message: "Account Not Found", e_code: "admin_search_usr_3"}); 
                                resolve(undefined)
                            }
                        });
                    }).catch(() => {
                        return undefined
                    });
                }
                const getUser = (key: string) => {
                    return new Promise<any | undefined>(async (resolve) => {
                        const query = 
                        `
                        SELECT * FROM user WHERE user.AccountKey = ?;
                        `

                        database.query(query, [key], async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_4"}); 
                                resolve(undefined);
                            }
                            resolve(result[0] || {});
                        });
                    }).catch(() => {
                        return undefined
                    });
                }
                const getTicket = (key: string) => {
                    return new Promise<any | undefined>(async (resolve) => {
                        const query = 
                        `
                        SELECT * FROM ticket WHERE ticket.AccountKey = ?;
                        `

                        database.query(query, [key], async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_5"}); 
                                resolve(undefined);
                            }
                            resolve(result[0] || {});
                        });
                    }).catch(() => {
                        return undefined
                    });
                }
                const getAccomodation = (key: string) => {
                    return new Promise<any | undefined>(async (resolve) => {
                        const query = 
                        `
                        SELECT * FROM accomodation WHERE accomodation.AccountKey = ?;
                        `

                        database.query(query, [key],async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_6"}); 
                                resolve(undefined);
                            }
                            resolve(result[0] || {});
                        });
                    }).catch(() => {
                        return undefined
                    });
                }

                const account = await getAccount(parseInt(id.toString()));
                let user: undefined | any = undefined
                let ticket: undefined | any = undefined
                let accomodation: undefined | any = undefined
                
                if (account != undefined) {
                    user = await getUser(account.AccountKey)
                    ticket = await getTicket(account.AccountKey)
                    accomodation = await getAccomodation(account.AccountKey)
                }

                if (account != undefined && user != undefined && ticket != undefined && accomodation != undefined) {
                    const removeSensitive = (data: any) => {
                        delete data["AccountKey"]
                        delete data["UserKey"]
                        delete data["TicketKey"]
                        delete data["AccomodationKey"]
                        delete data["id"]
                        delete data["password"]
                        delete data["isAdmin"]
                        return data
                    }

                    const returnObj = {
                        account: removeSensitive(account),
                        user: removeSensitive(user),
                        ticket: removeSensitive(ticket),
                        accomodation: removeSensitive(accomodation)
                    }
                    return sendResponse(200, returnObj)
                }
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_search_usr_7'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_search_usr_8'})
        }
    } else return
}