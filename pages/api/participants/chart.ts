import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import { INationalityCount } from '@/models/nationality-count.model';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data);
    }

    let response: INationalityCount[] = [];
    const query = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT 
                attendee.nationalityId,
                COUNT(attendee.nationalityId) AS count
            FROM
                attendee
            WHERE
                attendee.verified = TRUE
            GROUP BY attendee.nationalityId;
            `;

            database.query(query, async (err: any, result: INationalityCount[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "chart_1"}); 
                    resolve(false);
                }
                response = result;
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