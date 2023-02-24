import { IUser } from '@/models/user.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';


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
        let response: IUser | undefined = undefined;
        const query = async () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                SELECT account.AccountKey, account.firstName, account.lastName, account.email, account.nationality, account.dateOfBirth, account.contact, account.isAdmin, account.TicketKey, account.AccomodationKey,
                user.UserKey, user.fursonaName, user.fursonaSpecies, user.picture, user.registeredAt, user.SponsorLevel, user.isFursuiter
                FROM account, user
                WHERE user.AccountKey = account.AccountKey AND account.AccountKey = '${tokenPayload.accountKey}'
                `

                database.query(query, async (err: any, result: IUser[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "me_1"}); 
                        resolve(false);
                    }
                    response = result[0]
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "me_2"}); 
            });
        }
    
        if (await query()) {
            sendResponse(200, response);
        }
    } else return;
}