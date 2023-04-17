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
        const query = async () => {
            return new Promise<IUser | undefined>(async (resolve) => {
                const query = 
                `
                SELECT
                account.AccountKey, account.firstName, account.lastName, account.email, account.nationality, account.dateOfBirth, account.contact, account.registeredAt, account.isAdmin, account.TicketKey, account.AccomodationKey,
                user.UserKey, user.fursonaName, user.fursonaSpecies, user.picture, user.isFursuiter,
                ticket.sponsorLevel, ticket.isPaid, ticket.ticketType
                FROM account
                INNER JOIN user ON account.AccountKey = user.AccountKey
                LEFT JOIN ticket ON account.TicketKey = ticket.TicketKey
                WHERE account.AccountKey = '${tokenPayload.accountKey}'
                LIMIT 1
                `

                database.query(query, async (err: any, result: IUser[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "me_1"}); 
                        resolve(undefined);
                    }
                    resolve(result[0]);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "me_2"}); 
                return undefined
            });
        }
        
        const response: IUser | undefined = await query()
        if (response) {
            sendResponse(200, response);
        }
    } else return;
}