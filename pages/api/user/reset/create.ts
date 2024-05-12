// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import crypto from "crypto";
import {IAccount} from '@/models/account.model';
import * as mysql from "mysql";
import {findTemplate, sendMail} from '@/functions/mail/mail-controller';
import handlebars from "handlebars";
import { getAttendeeByEmail } from '@/services/attendee/service.attendee.select';
import { getFursona } from '@/services/fursona/service.fursona.select';
import { changeAttendeePasswordResetTokenId, updateAttendee } from '@/services/attendee/service.attendee.update';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const attendee = await getAttendeeByEmail(req.body.email.toLowerCase())
    let fursona = undefined
    if (attendee) fursona = await getFursona(attendee.fursonaId)

    if (attendee && fursona) {
        const clearPreviousToken = () => {
            return new Promise(async (resolve) => {
                const query = 
                `
                DELETE FROM passwordresettoken
                WHERE id = ?;
                `
    
                database.query(query, [attendee.passwordResetTokenId], async (err: any, result: IAccount[]) => {
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
                    token: token,
                    tokenExpireTime: Math.floor((Date.now() / 1000) + 600),
                }
    
                database.query(mysql.format(`INSERT INTO passwordresettoken (${Object.keys(payload).join(",")}) VALUES (?)`, [Object.values(payload)]), async (err: any, res: any) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "resCreate_3"}); 
                        resolve(false);
                    }

                    await changeAttendeePasswordResetTokenId(attendee, res.insertId)
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
            const props = await findTemplate(attendee.nationalityId==25? "hu" : "en", 'passwordReset')
            if (!props) {
                sendResponse(500, {message: "Failed to get email template.", e_code: "resCreate_5"}); 
            }
            else {
                const template = handlebars.compile(props.mail);
                const replacements = {
                    fursonaName: fursona.name,
                    resetURL: `${process.env.DOMAIN_ROOT}reset?token=${token}`,
                };
                props.mail = template(replacements)

                await sendMail({...props, address: attendee.email}, (err: string, result: string) => {
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