// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    let response: number = 0;
    const query = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT
            COUNT(ticket.extra1)
            AS count
            FROM ticket
            WHERE ticket.extra1 = '1'
            `

            database.query(query, async (err: any, result: number[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "part_1"}); 
                    resolve(false);
                }
                response = result[0]
                resolve(true);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "part_2"}); 
        });
    }

    if (await query()) {
        sendResponse(200, response);
    }
}