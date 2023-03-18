import { getAccountByKey, getUserByAccountKey } from '@/utils/getData';
import { TicketDatabase } from './../../../models/database.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';
import * as mysql from "mysql";
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getPrices } from '../defaults/tickets/prices';
import { findTemplate, sendMail } from '@/utils/mail-controller';
import handlebars from 'handlebars';
import i18n from '@/root/i18n';
import { getEarlyBirdExpDate, getStartDate } from '../defaults/tickets';
import { IFood } from '@/models/food.model';


const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}
const createDatePatternFromDate = (date: Date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + (date.getDate())).slice(-2);

    return `${year}.${month}.${day}.`
}
const createDatePatternWithOffset = (date: Date, index: number) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + (date.getDate()+(index-1))).slice(-2);
    
    return `${year}.${month}.${day}.`
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
        const conflict = async () => {
            return new Promise<boolean>(async (resolve) => {
                const query = 
                `
                SELECT * FROM ticket
                WHERE AccountKey = '${tokenPayload.accountKey}'
                `

                database.query(query, async (err: any, result: any) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "tcrt_1"}); 
                        resolve(true);
                    }
                    if (result.length) {
                        resolve(true)
                    }
                    else resolve(false);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "tcrt_2"}); 
            });
        }

        const hasConflict = await conflict()
    
        if (!hasConflict) {
            const runCreate = async () => {
                return await new Promise<boolean>(async (mainResolve) => {
                    database.getConnection((err, connection) => {
                        if (err) {
                            sendResponse(500, { message: "Unknown Error", e_code: "tcrt_3" });
                            mainResolve(false);
                        }
                        connection.beginTransaction(async (err) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                connection.release();
                                sendResponse(500, { message: "Error while creating the transaction.", e_code: "tcrt_4" });
                                mainResolve(false);
                            }
                            const rollback = (con: mysql.PoolConnection) => {
                                con.rollback(() => {
                                    con.release();
                                });
                            }
                
                            const createTicket = async (data: any) => {
                                return new Promise<boolean>(async (resolve) => {
                                    Object.keys(data).forEach(k => {
                                        try {
                                            (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                        } catch {
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "tcrt_5"});
                                            resolve(false);
                                        }
                                    })
    
                                    connection.query(mysql.format(`INSERT INTO ticket (${Object.keys(data).join(",")}) VALUES (?)`, [Object.values(data)]), (err: any, res: { insertId: any; }) => {
                                        if (err) {
                                            console.log("ERROR: ", err);
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "tcrt_6"});
                                            resolve(false);
                                            return;
                                        }
                                        else {
                                            resolve(true)
                                        }
                                    });
                                }).catch(() => {
                                    rollback(connection);
                                    sendResponse(500, {message: "Unknown Error", e_code: "tcrt_7"});
                                    return false;
                                });
                            }
                
                            const updateAccount = async (data: string) => {
                                return new Promise<boolean>(async (resolve) => {
                                    
                                    connection.query(`UPDATE account SET TicketKey = '${data}' WHERE AccountKey = '${tokenPayload.accountKey}'`, (err: any) => {
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

                            const ticketKey = uuidv4()
                            
                            let ticketPayload = new TicketDatabase();
                            _.assign(ticketPayload , _.pick(req.body, _.keys(ticketPayload)));
                            ticketPayload = JSON.parse(JSON.stringify(ticketPayload))

                            const now = new Date()
                            const prices = getPrices(now)
                            const price =
                                (ticketPayload.ticketType==='0'? prices[0].hu : 0) +
                                (ticketPayload.ticketType==='1'? prices[1].hu : 0) +
                                (ticketPayload.ticketType==='2'? prices[2].hu : 0) +
                                (ticketPayload.extra0? prices.extra0.hu : 0) +
                                (ticketPayload.extra1? prices.extra1.hu : 0) +
                                (ticketPayload.sponsorPrice!)

                            ticketPayload = {
                                ...ticketPayload,
                                AccountKey: tokenPayload.accountKey,
                                TicketKey: ticketKey,
                                totalPrice: price,
                                foodData: ticketPayload.foodData? JSON.stringify(ticketPayload.foodData) : ticketPayload.foodData,
                                startDay: toSqlDatetime(new Date(ticketPayload.startDay!)),
                                endDay: toSqlDatetime(new Date(ticketPayload.endDay!)),
                                creationDate: toSqlDatetime(now),
                            }
    
                            const ticketInsertionState: boolean = await createTicket(ticketPayload);
                            let accountUpdatestate: boolean = false
                            if (ticketInsertionState && ticketKey) accountUpdatestate = await updateAccount(ticketKey);
                            let mailState: boolean = false
                
                            const account = await getAccountByKey(tokenPayload.accountKey);
                            const user = await getUserByAccountKey(tokenPayload.accountKey)

                            if (!account || !user) {
                                rollback(connection);
                                sendResponse(500, { message: "Unknown Error", e_code: "tcrt_10" });
                                return
                            }

                            // SEND EMAIL
                            const props = await findTemplate(account.nationality, 'ticketCreate')
                            if (!props) {
                                rollback(connection);
                                sendResponse(500, {message: "Failed to get email template.", e_code: "tcrt_11"}); 
                                return
                            }
                            else {
                                // Create Summary Table
                                interface CustomFoodDataInterface {[index: number]: IFood[];}
                                const startDate = getStartDate()
                                const translationTable = (account.nationality == "hu")? i18n.i18n.languages.hu : i18n.i18n.languages.en
                                
                                let ticketRow = '';
                                let foodRow = '';
                                try {
                                    const foodTable: CustomFoodDataInterface = (account.nationality == "hu")? require("@/root/locales/hu.food.json") : require("@/root/locales/en.food.json")
                                    switch (ticketPayload.ticketType) {
                                        case '0':
                                            ticketRow = `<tr><td>${translationTable.ticket0Title} (${createDatePatternFromDate(new Date(ticketPayload.startDay!))})</td><td>${prices[0].hu} HUF</td></tr>`
                                            break;
                                        case '1':
                                            ticketRow = `<tr><td>${translationTable.ticket1Title} (${createDatePatternFromDate(new Date(ticketPayload.startDay!))} - ${createDatePatternFromDate(new Date(ticketPayload.endDay!))})</td><td>${prices[1].hu} HUF</td></tr>`
                                            break;
                                        case '2':
                                            ticketRow = `<tr><td>${translationTable.ticket2Title}</td><td>${prices[2].hu} HUF</td></tr>`
                                            break;
                                    }

                                    if (req.body.foodData) {
                                        for (const [key, value] of Object.entries(req.body.foodData as CustomFoodDataInterface)) {
                                            const foodName = foodTable[parseInt(key)].find((o) => o.id == parseInt(value))
                                            const offsetIndex = Object.keys(foodTable).findIndex((e) => e == key)
                                            foodRow = foodRow + `<tr><td>${createDatePatternWithOffset(startDate, ticketPayload.ticketType == '2'? offsetIndex+1 : offsetIndex)}</td><td>${foodName?.value}</td></tr>`
                                        }
                                    }
                                }
                                catch(e) {
                                    console.log(e)
                                    rollback(connection);
                                    sendResponse(500, {message: "Failed to create summary table.", e_code: "tcrt_12"}); 
                                    return
                                }
                                

                                const summaryTable = `
                                    ${(now.valueOf() < getEarlyBirdExpDate().valueOf())? `<tr style="color: #F741D5"><td colspan="2">${translationTable.ticketEarlyBird}</td></tr>` : '' }
                                    <tr style="color: #F741D5"><td colspan="2">${translationTable.ticketPrice}</td></tr>
                                    ${ticketRow}
                                    ${ticketPayload.extra0? `<tr><td>${translationTable.ticketExtra0}</td><td>+${prices.extra0.hu} HUF</td></tr>` : ''}
                                    ${ticketPayload.extra1? `<tr><td>${translationTable.ticketExtra1}</td><td>+${prices.extra1.hu} HUF</td></tr>` : ''}
                                    ${(ticketPayload.sponsorLevel && parseInt(ticketPayload.sponsorLevel) > 0)? `<tr><td>${translationTable.ticketSponsor}</td><td>+${ticketPayload.sponsorPrice} HUF</td></tr>` : ''}
                                    <tr style="color: #F741D5"><td>${translationTable.ticketFinalPrice}</td><td>${ticketPayload.totalPrice} HUF</td></tr>
                                    ${req.body.foodData? `<tr style="color: #F741D5"><td colspan="2">${translationTable.ticketFood}</td></tr>` : ''}
                                    ${foodRow}
                                `

                                const template = handlebars.compile(props.mail);
                                const replacements = {
                                    fursonaName: user.fursonaName,
                                    summaryTable: summaryTable,
                                    accountID: account.id
                                };
                                const htmlToSend = template(replacements);
                                props.mail = htmlToSend

                                await sendMail({...props, address: account.email}, (err: string, result: string) => {
                                    if (err) {
                                        sendResponse(500, {message: "Failed to send email.", e_code: "tcrt_13"}); 
                                    }
                                    else {
                                        mailState = true
                                    }
                                })
                            }

                            if (ticketInsertionState && accountUpdatestate && mailState) {
                                connection.commit(async function (err) {
                                    if (err) {
                                        console.log(err)
                                        connection.rollback(function () {
                                            sendResponse(500, { message: "Error While Committing", e_code: "tcrt_14" });
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
                sendResponse(201, {message: "Ticket Created"});
            }
        }
        else {
            sendResponse(400, {message: "User already has ticket", e_code: "tcrt_15"})
        }
    } else return;
}