import type { NextApiRequest, NextApiResponse } from 'next'
import { ILoginForm } from '@/models/login-form.model';
import * as bcrypt from 'bcrypt';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import { generateCookies } from '@/functions/auth/token-handler';
import { getAttendeeByEmail, getAttendeeFullData } from '@/services/attendee/service.attendee.select';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getFursona } from '@/services/fursona/service.fursona.select';
import { IFursona } from '@/models/newDbModels/fursona.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const isLoginForm = (x: any): x is ILoginForm => {
        if (typeof x.email === 'string' &&
            typeof x.password === 'string' &&
            typeof x.remember === 'boolean') {
            return true
        }
        else return false
    }

    const isValidForm = (x: ILoginForm) => {
        return x.email != '' &&
            x.password != '';
    }

    if (isLoginForm(req.body) && isValidForm(req.body)) {
        const authorize = async (attendee: IAttendee) => {
            return new Promise<void>(async (resolve) => {
                const isValid = await bcrypt.compare(req.body.password.trim(), attendee.password)

                if (isValid) {
                    if (attendee.verified == false) {
                        sendResponse(401, { message: `Unverified`, e_code: "login_1" });
                        resolve();
                    }
                    else {
                        const userData = await getAttendeeFullData(attendee.id as number)

                        if (req.body.remember) {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                generateCookies("NEWREMEMBER", attendee.accountKey)
                                )
                            .json(userData)
                            resolve();
                        } else {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                generateCookies("NEW", attendee.accountKey)
                                )
                            .json(userData)
                            resolve();
                        }
                    }
                }
                else {
                    sendResponse(401, { message: `Wrong credentials`, e_code: "login_2" });
                    resolve();
                }
            }).catch(() => {
                sendResponse(500, { message: "Unknown Error", e_code: "login_3" });
            });
        }

        const attendee: IAttendee | undefined = await getAttendeeByEmail(req.body.email.toLowerCase());
        let fursona: IFursona | undefined;
        if (attendee) fursona = await getFursona(attendee.fursonaId)
        
        if (attendee && fursona) {
            await authorize(attendee);
        }
        else sendResponse(401, { message: `Wrong credentials`, e_code: "login_2" });
    }
    else sendResponse(400, { message: "Malformed request:", data: req.body });
}