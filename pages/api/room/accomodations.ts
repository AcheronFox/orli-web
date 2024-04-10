import { IAccomodation } from '../../../models/accomodation.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/root/functions/utils/mysql'
import isMethodAllowed from '@/root/functions/auth/isMethodAllowed';
import verifyToken from '@/root/functions/auth/veryifToken';


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
        let response: IAccomodation[] = [];
        const query = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT id, roomId FROM accomodation;
                `

                database.query(query, async (err: any, result: IAccomodation[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "accom_1"}); 
                        resolve(false);
                    }
                    response = result
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "accom_2"});
                return false
            });
        }

        if (await query()) {
            sendResponse(200, response);
        }
    } else return
}