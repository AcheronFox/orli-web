import resetPassword from '@/functions/auth/password-handler';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import { IPasswordResetToken } from '@/models/password-reset-token.model';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const getToken = async () => {
        return new Promise<IPasswordResetToken | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM password_reset_tokens
            WHERE token = ?
            LIMIT 1;
            `

            database.query(query, [req.body.token], async (err: any, result: IPasswordResetToken[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "reset_1"}); 
                    resolve(undefined);
                }
                resolve(result[0]);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "reset_2"}); 
        });
    }

    const token = await getToken()

    if (token) {
        if (token.token_exp > Math.floor(Date.now() / 1000)) {
            const account = await getAccountByKey(token.AccountKey)

            if (account) {
                const result = await resetPassword(req.body.password, account.AccountKey)

                const clearToken = () => {
                    return new Promise(async (resolve) => {
                        const query = 
                        `
                        DELETE FROM password_reset_tokens
                        WHERE AccountKey = ?;
                        `
            
                        database.query(query, [account.AccountKey], async (err: any, result: IAccount[]) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "reset_3"}); 
                                resolve(undefined);
                            }
                            resolve(undefined)
                        });
                    }).catch(() => {
                        sendResponse(500, {message: "Unknown Error", e_code: "reset_4"}); 
                    });
                }

                await clearToken()

                if (!result?.success) {
                    sendResponse(400, {message: result?.error, e_code: "reset_5"});
                }
                else {
                    sendResponse(200, {message: "Password Reset"});
                }
            }
            else {
                sendResponse(404, {message: "Account Not Found", e_code: "reset_6"});
            }
        }
        else {
            sendResponse(401, {message: "Invalid Token", e_code: "reset_7"});
        }
    }
    else {
        sendResponse(401, {message: "Invalid Token", e_code: "reset_8"});
    }
}