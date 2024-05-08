// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import { ITicketCount } from '@/models/ticket-count.model';


const ticketLimitQuery = async () => {
    return new Promise<undefined | ITicketCount>(async (resolve) => {
        const query = 
        `
        SELECT
            COUNT(CASE WHEN ticket.earlyArrival = '1' THEN 1 END) AS early,
            COUNT(CASE WHEN ticket.lateDeparture = '1' THEN 1 END) AS late,
            COUNT(CASE WHEN ticket.type = 'WACC' THEN 1 END) AS countWACC,
            COUNT(CASE WHEN ticket.type = 'TENT' THEN 1 END) AS countTENT
        FROM 
            ticket
        RIGHT JOIN 
            attendee ON ticket.id = attendee.ticketId
        WHERE 
            attendee.staff = '0';
        `

        /*
        Because I'm not sure if I re-wrote the above query correctly, I will leave the original one here:

        SELECT
            SUM(
                CASE
                WHEN ticket.extra1 = '1' THEN 1
                ELSE 0
                END
            ) AS extra1Count,
            SUM(
                CASE
                WHEN ticket.ticketType = '1' THEN 1
                ELSE 0
                END
            ) AS ticket1Count,
            SUM(
                CASE
                WHEN ticket.ticketType = '2' THEN 1
                ELSE 0
                END
            ) AS ticket2Count
        FROM ticket
        RIGHT JOIN account ON ticket.TicketKey = account.TicketKey
        WHERE account.isStaff = "0"
        */

        database.query(query, async (err: any, result: ITicketCount[]) => {
            if (err) {
                console.log("ERROR: ", err);
                resolve(undefined);
            }
            if (result.length) {
                resolve(result[0])
            }
            else {
                resolve(undefined)
            }
        });
    })
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const response: ITicketCount | undefined = await ticketLimitQuery();
    response!.countWACC = 800
    if (response != undefined) {
        sendResponse(200, response);
    }
    else sendResponse(500, {message: "Unknown Error", e_code: "tck_limit_1"}); 
}

export {ticketLimitQuery}