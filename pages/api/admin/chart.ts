import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import verifyToken from '@/functions/auth/veryifToken';
import { isAdminAccount } from './auth';
import database from '@/functions/utils/mysql';
import { IAdminChart } from '@/models/admin.model';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';

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
        const account: IAttendee | undefined = await getAttendeeByAccountKey(tokenPayload.accountKey);
        if (account) {
            if (await isAdminAccount(account)) {
                const getTickets = async () => {
                    return new Promise<undefined | any>(async (resolve) => {
                        const query = 
                        `
                        SELECT ticket.ticketType, COUNT(ticket.ticketType) as count
                        FROM ticket WHERE ticket.isPaid = 1
                        GROUP BY ticket.ticketType;
                        `
            
                        database.query(query, async (err: any, result: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_chart_1"}); 
                                resolve(undefined);
                            }
                            resolve(result);
                        });
                    })
                }
                const getVerified = async () => {
                    return new Promise<undefined | any>(async (resolve) => {
                        const query = 
                        `
                        SELECT account.isVerified, COUNT(account.isVerified) as count
                        FROM account
                        GROUP BY account.isVerified;
                        `
            
                        database.query(query, async (err: any, result: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_chart_1"}); 
                                resolve(undefined);
                            }
                            resolve(result);
                        });
                    })
                }
                const getPaid = async () => {
                    return new Promise<undefined | any>(async (resolve) => {
                        const query = 
                        `
                        SELECT ticket.isPaid, COUNT(ticket.isPaid) as count, ticket.paymentMethod, COUNT(ticket.paymentMethod) as methodCount
                        FROM ticket
                        GROUP BY ticket.isPaid, ticket.paymentMethod;
                        `
            
                        database.query(query, async (err: any, result: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "admin_chart_1"}); 
                                resolve(undefined);
                            }
                            resolve(result);
                        });
                    })
                }

                const ticketData = await getTickets()
                const paidData = await getPaid()
                const verifiedData = await getVerified()

                if (ticketData != undefined && paidData != undefined && verifiedData != undefined) {
                    const data: IAdminChart = {
                        verified: verifiedData,
                        payment: paidData,
                        ticket: ticketData
                    }
                    return sendResponse(200, data)
                }
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_chart_1'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_chart_1'})
        }
    } else return
}