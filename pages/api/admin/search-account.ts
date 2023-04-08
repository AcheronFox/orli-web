import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';
import verifyToken from '@/utils/veryifToken';
import { isAdminAccount } from './auth';
import database from '@/utils/mysql';


const generateSelectQuery = (query: string, data: any) => {
    query = `${query} WHERE`
    const keys = Object.keys(data)

    keys.map((key: string, i) => {
        query = `${query} ${key} LIKE '%${data[key]}%'`
        if (i+1 < keys.length) {
            query = `${query} AND`
        }
    })
    return query
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
                if (req.body.pageSize == undefined || req.body.currentPage == undefined) {
                    return sendResponse(400, {message: "Missing pageSize or currentPage prop", e_code: 'admin_search_usr_'})
                }

                const pageSize = req.body.pageSize
                const currentPage = req.body.currentPage

                const getAccounts = (data: any) => {
                    return new Promise<any[] | undefined>(async (resolve) => {
                        let query = 
                        `SELECT * FROM account`

                        if (data) {
                            query = generateSelectQuery(query, data)
                        }
                        console.log(query)
        
                        database.query(query, async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "export_3"}); 
                                resolve(undefined);
                            }
                            resolve(result);
                        });
                    }).catch(() => {
                        sendResponse(500, {message: "Unknown Error", e_code: "export_4"});
                        return undefined
                    });
                }

                const accounts = await getAccounts(req.body.searchParams);

                if (accounts != undefined) {
                    if (accounts.length) {
                        accounts.forEach((item) => {
                            delete item['password']
                            delete item['AccountKey']
                            delete item['TicketKey']
                            delete item['AccomodationKey']
                        })

                        const chunks = _.chunk(accounts, pageSize);
                        return sendResponse(200, chunks[currentPage])
                    }
                    else return sendResponse(200, accounts)
                }
                
            }
            else {
                return sendResponse(404, {message: "Authentication Failed", e_code: 'admin_search_usr_'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_search_usr_'})
        }
    } else return
}