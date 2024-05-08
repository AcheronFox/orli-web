// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import verifyToken from '@/functions/auth/veryifToken';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import * as mysql from "mysql";
import _ from 'lodash';
import { findTemplate, sendMail } from '@/functions/mail/mail-controller';
import handlebars from 'handlebars';
import { ticketLimitQuery } from './limits';
import { ITicketForm } from '@/models/ticket-form.model';
import { getFursona } from '@/services/fursona/service.fursona.select';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import {configuration} from "@/private/app.config"
import { ITicket } from '@/models/newDbModels/ticket.model';
import { getNationality } from '@/services/nationality/service.nationality';
import { getTicketById } from '@/services/ticket/service.ticket.select';


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
        const serverDate = new Date()
        if (!((serverDate.getTime() > configuration.registration.start.getTime()) && (serverDate.getTime() < configuration.registration.end.getTime()))) {
            sendResponse(400, {message: "Time limit exceeded", e_code: "tcrt_17"});
            return;
        }

        const limitQuery = async (queryData: ITicketForm, attendee: IAttendee) => {
            return new Promise<boolean>(async (resolve) => {
                if (attendee.staff) return resolve(false)
                
                const currentState = await ticketLimitQuery()
                if (!currentState) return resolve(true)
                let result = false

                if (queryData.early) {
                    if (currentState.early >= (configuration.ticket.types.find((o) => o.name == "EARLY")?.limit || 0)) return result = false
                }
                if (queryData.late) {
                    if (currentState.late >= (configuration.ticket.types.find((o) => o.name == "LATE")?.limit || 0)) return result = false
                }

                switch (queryData.ticketType) {
                    case 'WACC':
                        if (currentState.countWACC >= (configuration.ticket.types.find((o) => o.name == "WACC")?.limit || 0)) result = true
                        break;
                    case 'TENT':
                        if (currentState.countTENT >= (configuration.ticket.types.find((o) => o.name == "TENT")?.limit || 0)) result = true
                        break;
                    default:
                        break;
                }
                resolve(result)
            })
        }

        const calcPrice = (queryData: ITicketForm) => {
            let price = 
            (queryData.ticketType=="WACC"? parseInt(configuration.ticket.types.find((o) => o.name == 'WACC')!.price.toString().replaceAll(' ', '')) : 0)
            +
            (queryData.ticketType=="TENT"? parseInt(configuration.ticket.types.find((o) => o.name == 'TENT')!.price.toString().replaceAll(' ', '')) : 0)
            + 
            (queryData.early? parseInt(configuration.ticket.types.find((o) => o.name == 'EARLY')!.price.toString().replaceAll(' ', '')) : 0) 
            +
            (queryData.late? parseInt(configuration.ticket.types.find((o) => o.name == 'LATE')!.price.toString().replaceAll(' ', '')) : 0)
            +
            (queryData.sponsorPrice)

            return price
        }

        const attendee = await getAttendeeByAccountKey(tokenPayload.accountKey);
        const fursona = await getFursona(attendee!.id!)

        if (await getTicketById(attendee!.id!) || !attendee || !fursona) return;
        const hasReachedLimit = await limitQuery(req.body, attendee)
    
        if (!hasReachedLimit) {
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
                
                            const createTicket = async (data: ITicketForm) => {
                                return new Promise<number>(async (resolve) => {
                                    Object.keys(data).forEach(k => {
                                        try {
                                            (typeof (data[k as keyof typeof data]) == 'string')? ((data[k as any as keyof typeof data] as any) = (data[k as keyof typeof data] as any).trim()) : {};
                                        } catch {
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "tcrt_5"});
                                            resolve(0);
                                        }
                                    })

                                    const payload: ITicket = {
                                        type: data.ticketType,
                                        earlyArrival: data.early,
                                        lateDeparture: data.late,
                                        sponsorLevel: ((data.sponsorLevel == '0') ? 'None' : ((data.sponsorLevel == '1') ? 'Regular' : 'Super')),
                                        shirtSize: data.shirt || undefined,
                                        sponsorPrice: data.sponsorPrice,
                                        totalPrice: calcPrice(req.body),
                                        isPaid: false,
                                        arrivalDate: '',
                                        departureDate: ''
                                    }
    
                                    connection.query(mysql.format(`INSERT INTO ticket (${Object.keys(payload).join(",")}) VALUES (?)`, [Object.values(payload)]), (err: any, res: any) => {
                                        if (err) {
                                            console.log("ERROR: ", err);
                                            rollback(connection);
                                            sendResponse(500, {message: "Unknown Error", e_code: "tcrt_6"});
                                            resolve(0);
                                            return;
                                        }
                                        else {
                                            resolve(res.insertId)
                                        }
                                    });
                                }).catch(() => {
                                    rollback(connection);
                                    sendResponse(500, {message: "Unknown Error", e_code: "tcrt_7"});
                                    return 0;
                                });
                            }
                
                            const updateAccount = async (data: number) => {
                                return new Promise<boolean>(async (resolve) => {
                                    
                                    connection.query(`UPDATE attendee SET ticketId = ? WHERE AccountKey = ?;`, [data, tokenPayload.accountKey], (err: any) => {
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

                            const now = new Date()
    
                            const ticketInsertionState: number = await createTicket(req.body);
                            let accountUpdatestate: boolean = false
                            if (ticketInsertionState) accountUpdatestate = await updateAccount(ticketInsertionState);
                            let mailState: boolean = false

                            if (!attendee || !fursona) {
                                rollback(connection);
                                sendResponse(500, { message: "Unknown Error", e_code: "tcrt_10" });
                                return
                            }

                            // SEND EMAIL
                            const nat = await getNationality(attendee.nationalityId!)
                            const props = await findTemplate(nat?.iso2!, 'ticketCreate')
                            if (!props || !nat) {
                                rollback(connection);
                                sendResponse(500, {message: "Failed to get email template.", e_code: "tcrt_11"}); 
                                return
                            }
                            else {
                                // Create Summary Table
                                const translationTable: Language = (nat.iso2 == "hu")? require("@/locales/hu/hu.lang.ts") : require("@/locales/en/en.lang.ts")
                                
                                let ticketRow = '';
                                try {
                                    switch (req.body.ticketType) {
                                        case 'WACC':
                                            ticketRow = `<tr><td>${translationTable.ticketWACC}</td><td>${configuration.ticket.types.find((o) => o.name == 'WACC')?.price} HUF</td></tr>`
                                            break;
                                        case 'TENT':
                                            ticketRow = `<tr><td>${translationTable.ticketTENT}</td><td>${configuration.ticket.types.find((o) => o.name == 'TENT')?.price} HUF</td></tr>`
                                            break;
                                    }
                                }
                                catch(e) {
                                    console.log(e)
                                    rollback(connection);
                                    sendResponse(500, {message: "Failed to create summary table.", e_code: "tcrt_12"}); 
                                    return
                                }
                                

                                const summaryTable = `
                                    ${(now.valueOf() < configuration.ticket.dates.earlyBirdEnd.valueOf())? `<tr style="color: #ffae00"><td colspan="2">${translationTable.ticketEarlyBird}</td></tr>` : '' }
                                    <tr style="color: #ffae00"><td colspan="2">${translationTable.ticketPrice}</td></tr>
                                    ${ticketRow}
                                    ${req.body.early? `<tr><td>${nat.iso2=='hu'? '0. nap' : 'Early Arrival'}</td><td>+${configuration.ticket.types.find((o) => o.name == 'EARLY')?.price} HUF</td></tr>` : ''}
                                    ${req.body.late? `<tr><td>${nat.iso2=='hu'? 'Ráadás' : 'Late Departure'}</td><td>+${configuration.ticket.types.find((o) => o.name == 'LATE')?.price} HUF</td></tr>` : ''}
                                    ${(req.body.sponsorLevel && parseInt(req.body.sponsorLevel) > 0)? `<tr><td>${translationTable.ticketSponsor}</td><td>+${req.body.sponsorPrice} HUF</td></tr>` : ''}
                                    <tr style="color: #ffae00"><td>${translationTable.ticketFinalPrice}</td><td>${calcPrice(req.body)} HUF</td></tr>
                                    ${(req.body.shirt && req.body.sponsorLevel && parseInt(req.body.sponsorLevel) == 2)? `<tr style="color: #ffae00"><td colspan="2">${translationTable.ticketSponsorShirt}</td></tr>` : ''}
                                    ${(req.body.shirt && req.body.sponsorLevel && parseInt(req.body.sponsorLevel) == 2)? `<tr><td>${translationTable.ticketShirtSize}</td><td>${req.body.shirt}</td></tr>` : ''}
                                `

                                const template = handlebars.compile(props.mail);
                                const replacements = {
                                    fursonaName: fursona.name,
                                    summaryTable: summaryTable,
                                    accountID: attendee.id
                                };
                                const htmlToSend = template(replacements);
                                props.mail = htmlToSend

                                await sendMail({...props, address: attendee.email}, (err: string, result: string) => {
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
            console.log(result)
            if (result) {
                sendResponse(201, {message: "Ticket Created"});
            }
        }
        else {
            sendResponse(400, {message: "Ticket limit reached", e_code: "tcrt_15"})
        }
    } else return;
}