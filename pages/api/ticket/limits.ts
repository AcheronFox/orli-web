// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { ITicketCount } from '@/models/ticket-count.model';


const ticketLimitQuery = async () => {
    return new Promise<undefined | ITicketCount>(async (resolve) => {
        const query = 
        `
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
        `

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

    if (response != undefined) {
        sendResponse(200, response);
    }
    else sendResponse(500, {message: "Unknown Error", e_code: "tck_limit_1"}); 
}

export {ticketLimitQuery}