import { IUser } from '@/models/user.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/utils/mysql'
import isMethodAllowed from '@/utils/isMethodAllowed';
import crypto from "crypto";
import { IAccount } from '@/models/account.model';
import * as mysql from "mysql";
import { findTemplate, sendMail } from '@/utils/mail-controller';
import handlebars from "handlebars";
import { getAccountByEmail, getUserByAccountKey } from '@/utils/getData';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const account = await getAccountByEmail(req.body.email.toLowerCase())
    let user = undefined
    if (account) user = await getUserByAccountKey(account.AccountKey)

    if (account && user) {
        const clearPreviousToken = () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                DELETE FROM password_reset_tokens
                WHERE AccountKey = ?;
                `
    
                database.query(query, [account.AccountKey], async (err: any, result: IAccount[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "resCreate_1"}); 
                        resolve(undefined);
                    }
                    resolve(undefined)
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "resCreate_2"}); 
            });
        }

        const createToken = () => {
            return new Promise<string>(async (resolve) => {
                crypto.randomBytes(48, (err, buffer) => {
                    if (err) {
                        console.log(err)
                        resolve('')
                    }
                    else {
                        resolve(crypto.createHash('sha256').update(buffer.toString('hex')).digest('hex'))
                    }
                })
            })
        }

        const createEntry = async (token: string) => {
            return new Promise<boolean>(async (resolve) => {
                const payload = {
                    AccountKey: account.AccountKey,
                    token: token,
                    token_exp: Math.floor((Date.now() / 1000) + 600),
                }
    
                database.query(mysql.format(`INSERT INTO password_reset_tokens (${Object.keys(payload).join(",")}) VALUES (?)`, [Object.values(payload)]), (err: any) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "resCreate_3"}); 
                        resolve(false);
                    }
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "resCreate_4"}); 
            });
        }

        await clearPreviousToken()
        const token = await createToken()
        const tokenResult = await createEntry(token)

        if (tokenResult) {
            // SEND EMAIL
            const props = await findTemplate(account.nationality, 'passwordReset')
            if (!props) {
                sendResponse(500, {message: "Failed to get email template.", e_code: "resCreate_5"}); 
            }
            else {
                const template = handlebars.compile(props.mail);
                const replacements = {
                    fursonaName: user.fursonaName,
                    resetURL: `${process.env.DOMAIN_ROOT}reset?token=${token}`,
                };
                const htmlToSend = template(replacements);
                props.mail = htmlToSend

                await sendMail({...props, address: account.email}, (err: string, result: string) => {
                    if (err) {
                        sendResponse(500, {message: "Failed to send email.", e_code: "resCreate_6"}); 
                    }
                    else {
                        sendResponse(200, "Token Created");
                    }
                })
            }
        }
    }
    else {
        sendResponse(404, {message: "No Account Found", e_code: "resCreate_7"}); 
    }
}