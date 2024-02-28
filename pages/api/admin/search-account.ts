import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';
import verifyToken from '@/functions/auth/veryifToken';
import { isAdminAccount } from './auth';
import database from '@/functions/utils/mysql';
import { AccomodationDatabase, SafeAccountDatabase, TicketDatabase, UserDatabase } from '@/models/database.model';
import generatePayload from '@/utils/generatePayload';


const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffset
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
const generateBooleanQuery = (query: string, data: any, table: string) => {
    data.forEach((key: { [x: string]: any; }, i: number) => {
        const column = Object.keys(key)[0]
        if (key[column as any]) {
            query = `${query} ${table}.${column} IS NOT NULL OR ${table}.${column} != ''`
        }
        else {
            query = `${query} ${table}.${column} IS NULL`
        }
        if (i+1 < data.length) {
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

                const getAccounts = (data: any, ticketData: any, userData: any, accomodationData: any, booleanData: any) => {
                    return new Promise<any[] | undefined>(async (resolve) => {
                        let query = 
                        `SELECT account.*,
                        user.fursonaName, user.fursonaSpecies,
                        ticket.sponsorLevel, ticket.isPaid, ticket.paymentMethod
                        FROM account
                        LEFT JOIN ticket ON account.TicketKey = ticket.TicketKey
                        LEFT JOIN user ON user.AccountKey = account.AccountKey
                        LEFT JOIN accomodation ON accomodation.AccountKey = account.AccountKey
                        `

                        let didGenerateQuery: boolean = false
                        if (!_.isEmpty(data)) {
                            if (data.hasOwnProperty("dateOfBirth") && data.dateOfBirth) {
                                data.dateOfBirth = toSqlDatetime(new Date(data.dateOfBirth.trim())).split(' ')[0];
                            }
                            query = `${query} WHERE`
                            query = generateSelectQuery(query, data, 'account')
                            didGenerateQuery = true
                        }
                        if (!_.isEmpty(ticketData)) {
                            if (didGenerateQuery) query = `${query} AND`
                            else query = `${query} WHERE`
                            query = generateSelectQuery(query, ticketData, 'ticket')
                            didGenerateQuery = true
                        }
                        if (!_.isEmpty(userData)) {
                            if (didGenerateQuery) query = `${query} AND`
                            else query = `${query} WHERE`
                            query = generateSelectQuery(query, userData, 'user')
                            didGenerateQuery = true
                        }
                        if (!_.isEmpty(accomodationData)) {
                            if (didGenerateQuery) query = `${query} AND`
                            else query = `${query} WHERE`
                            query = generateSelectQuery(query, accomodationData, 'accomodation')
                            didGenerateQuery = true
                        }
                        if (!_.isEmpty(booleanData)) {
                            if (didGenerateQuery) query = `${query} AND`
                            else query = `${query} WHERE`
                            query = generateBooleanQuery(query, booleanData, 'account')
                            didGenerateQuery = true
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

                const accountPayload = generatePayload(SafeAccountDatabase, req.body.searchQuery);
                const ticketPayload = generatePayload(TicketDatabase, req.body.searchQuery);
                const userPayload = generatePayload(UserDatabase, req.body.searchQuery)
                const accomodation = generatePayload(AccomodationDatabase, req.body.searchQuery)

                let booleanData = req.body.searchQuery.boolean
                booleanData = booleanData.filter((element: any) => {
                    return Object.keys(element).length !== 0;
                  });

                const accounts = await getAccounts(accountPayload, ticketPayload, userPayload, accomodation, booleanData);

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