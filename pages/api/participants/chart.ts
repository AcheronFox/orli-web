// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import { INationalityCount } from '@/models/nationality-count.model';
import isMethodAllowed from '@/utils/isMethodAllowed';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    let response: INationalityCount[] = [];
    const query = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT account.nationality, COUNT(account.nationality) as count
            FROM account WHERE account.isVerified = 1
            GROUP BY account.nationality;
            `

            database.query(query, async (err: any, result: INationalityCount[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "chart_1"}); 
                    resolve(false);
                }
                response = result
                resolve(true);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "chart_2"}); 
        });
    }

    if (await query()) {
        sendResponse(200, response);
    }
}