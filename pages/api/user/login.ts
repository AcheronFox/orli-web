import { getAccountByEmail, getUserByAccountKey } from '@/utils/getData';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ILoginForm } from '@/models/login-form.model';
import { IAccount } from '@/models/account.model';
import { IUser, UserData } from '@/models/user.model';
import * as bcrypt from 'bcrypt';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import { generateCookies } from '@/functions/auth/token-handler';

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
        if (x.email != '' &&
            x.password != '') {
            return true
        }
        else return false
    }

    if (isLoginForm(req.body) && isValidForm(req.body)) {
        const authorize = async (account: IAccount, user: IUser) => {
            return new Promise<void>(async (resolve) => {
                const isValid = await bcrypt.compare(req.body.password.trim(), account.password)

                if (isValid) {
                    if (account.isVerified == 0) {
                        sendResponse(401, { message: `Unverified`, e_code: "login_1" });
                        resolve();
                    }
                    else {
                        let userData = new UserData()
                        _.assign(userData , _.pick({...user, ...account}, _.keys(userData)));
                        userData = JSON.parse(JSON.stringify(userData))

                        if (req.body.remember) {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                generateCookies("NEWREMEMBER", account.AccountKey)
                                )
                            .json(userData)
                            resolve();
                        } else {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                generateCookies("NEW", account.AccountKey)
                                )
                            .json(userData)
                            resolve();
                        }
                    }
                }
                else {
                    sendResponse(401, { message: `Wrong password`, e_code: "login_2" });
                    resolve();
                }
            }).catch(() => {
                sendResponse(500, { message: "Unknown Error", e_code: "login_3" });
            });
        }

        const account: IAccount | undefined = await getAccountByEmail(req.body.email.toLowerCase());
        let user: IUser | undefined;
        if (account) user = await getUserByAccountKey(account.AccountKey)
        
        if (account && user) {
            await authorize(account, user);
        }
        else sendResponse(404, { message: "User Not Found:", e_code: "login_4"});
    }
    else sendResponse(400, { message: "Malformed request:", data: req.body });
}