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


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const getAccount = async () => {
        return new Promise<IAccount | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM account
            WHERE email = '${req.body.email.toLowerCase()}'
            `

            database.query(query, async (err: any, result: IAccount[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "resCreate_1"}); 
                    resolve(undefined);
                }
                if (result) {
                    resolve(result[0]);
                }
                else {
                    resolve(undefined)
                }
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "resCreate_2"}); 
        });
    }

    const getUser = async (data: IAccount) => {
        return new Promise<IUser | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM user
            WHERE AccountKey = '${data.AccountKey}'
            `

            database.query(query, async (err: any, result: IUser[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "resCreate_1"}); 
                    resolve(undefined);
                }
                if (result) {
                    resolve(result[0]);
                }
                else {
                    resolve(undefined)
                }
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "resCreate_2"}); 
        });
    }

    const account = await getAccount()
    let user = undefined
    if (account) user = await getUser(account)

    if (account && user) {
        const clearPreviousToken = () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                DELETE FROM password_reset_tokens
                WHERE AccountKey = '${account.AccountKey}'
                `
    
                database.query(query, async (err: any, result: IAccount[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "resCreate_3"}); 
                        resolve(undefined);
                    }
                    resolve(undefined)
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "resCreate_4"}); 
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
                        sendResponse(500, {message: "Unknown Error", e_code: "resCreate_5"}); 
                        resolve(false);
                    }
                    resolve(true);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "resCreate_6"}); 
            });
        }

        await clearPreviousToken()
        const token = await createToken()
        const tokenResult = await createEntry(token)

        if (tokenResult) {
            // SEND EMAIL
            const props = await findTemplate(account.nationality, 'passwordReset')
            if (!props) {
                sendResponse(500, {message: "Failed to get email template.", e_code: "resCreate_7"}); 
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
                        sendResponse(500, {message: "Failed to send email.", e_code: "resCreate_8"}); 
                    }
                    else {
                        sendResponse(200, "Token Created");
                    }
                })
            }
        }
    }
    else {
        sendResponse(404, {message: "No Account Found", e_code: "resCreate_9"}); 
    }
}