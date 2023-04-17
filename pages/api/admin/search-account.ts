import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';
import verifyToken from '@/utils/veryifToken';
import { isAdminAccount } from './auth';
import database from '@/utils/mysql';
import { SafeAccountDatabase, TicketDatabase } from '@/models/database.model';


const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}

const generateSelectQuery = (query: string, data: any, table: string) => {
    const keys = Object.keys(data)

    keys.map((key: string, i) => {
        query = `${query} ${table}.${key} LIKE '%${data[key]}%'`
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
                    return sendResponse(400, {message: "Missing pageSize or currentPage prop", e_code: 'admin_search_usr_1'})
                }

                const pageSize = req.body.pageSize
                const currentPage = req.body.currentPage

                const getAccounts = (data: any, ticketData: any) => {
                    return new Promise<any[] | undefined>(async (resolve) => {
                        let query = 
                        `SELECT account.*, ticket.sponsorLevel, ticket.isPaid, ticket.paymentMethod
                        FROM account LEFT JOIN ticket ON account.TicketKey = ticket.TicketKey`

                        let didGenerateQuery: boolean = false
                        if (!_.isEmpty(data)) {
                            didGenerateQuery = true
                            if (data.hasOwnProperty("dateOfBirth") && data.dateOfBirth) {
                                data.dateOfBirth = toSqlDatetime(new Date(data.dateOfBirth.trim())).split(' ')[0];
                            }
                            query = `${query} WHERE`
                            query = generateSelectQuery(query, data, 'account')
                        }
                        if (!_.isEmpty(ticketData)) {
                            if (didGenerateQuery) query = `${query} AND`
                            else query = `${query} WHERE`
                            query = generateSelectQuery(query, ticketData, 'ticket')
                        }

                        database.query(query, async (err: any, result: any[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_2"}); 
                                resolve(undefined);
                            }
                            resolve(result);
                        });
                    }).catch(() => {
                        sendResponse(500, {message: "Unknown Error", e_code: "admin_search_usr_3"});
                        return undefined
                    });
                }

                let accountPayload = new SafeAccountDatabase();
                _.assign(accountPayload , _.pick(req.body.searchQuery, _.keys(accountPayload)));
                Object.keys(accountPayload).forEach((key) => {
                    if(accountPayload[key as keyof typeof accountPayload] === '') {
                        accountPayload[key as keyof typeof accountPayload] = undefined;
                    }
                })
                accountPayload = JSON.parse(JSON.stringify(accountPayload))

                let ticketPayload = new TicketDatabase();
                _.assign(ticketPayload , _.pick(req.body.searchQuery, _.keys(ticketPayload)));
                Object.keys(ticketPayload).forEach((key) => {
                    if(ticketPayload[key as keyof typeof ticketPayload] === '') {
                        ticketPayload[key as keyof typeof ticketPayload] = undefined;
                    }
                })
                ticketPayload = JSON.parse(JSON.stringify(ticketPayload))

                const accounts = await getAccounts(accountPayload, ticketPayload);

                if (accounts != undefined) {
                    if (accounts.length) {
                        accounts.forEach((item) => {
                            delete item['password']
                            delete item['AccountKey']
                            delete item['TicketKey']
                            delete item['AccomodationKey']
                            delete item['isAdmin']
                        })

                        const chunks = _.chunk(_.orderBy(accounts, ['id'],['asc']), pageSize);
                        return sendResponse(200, {count: accounts.length, data: chunks[currentPage]})
                    }
                    else return sendResponse(200, {count: accounts.length, data: accounts})
                }
                
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_search_usr_4'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_search_usr_5'})
        }
    } else return
}