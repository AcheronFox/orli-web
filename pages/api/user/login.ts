import type { NextApiRequest, NextApiResponse } from 'next'
import { ILoginForm } from '@/models/login-form.model';
import { IAccount } from '@/models/account.model';
import { IUser, UserData } from '@/models/user.model';
import database from '@/utils/mysql';
import * as bcrypt from 'bcrypt';
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { generateCookies } from '@/utils/token-handler';

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

        const findAccount = async () => {
            return new Promise<IAccount | undefined>(async (resolve) => {
                database.query(`SELECT * FROM account WHERE email = '${req.body.email.toLowerCase()}'`, async (err, result) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, { message: "Unknown Error", e_code: "login_1" });
                        resolve(undefined);
                    }
                    if (result.length) {
                        resolve(result[0])
                    }
                    else {
                        resolve(undefined);
                        sendResponse(404, { message: `No user with address: ${req.body.email}`, e_code: "login_2" });
                    }
                })
            }).catch(() => {
                sendResponse(500, { message: "Unknown Error", e_code: "login_3" });
            });
        }

        const findUser = async (account: IAccount) => {
            return new Promise<IUser | undefined>(async (resolve) => {
                database.query(`SELECT * FROM user WHERE AccountKey = '${account.AccountKey}'`, async (err, result) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, { message: "Unknown Error", e_code: "login_4" });
                        resolve(undefined);
                    }
                    if (result.length) {
                        resolve(result[0])
                    }
                    else {
                        resolve(undefined);
                        sendResponse(404, { message: `No user with address: ${req.body.email.toLowerCase()}`, e_code: "login_5" });
                    }
                })
            }).catch(() => {
                sendResponse(500, { message: "Unknown Error", e_code: "login_6" });
            });
        }



        const authorize = async (account: IAccount, user: IUser) => {
            return new Promise<void>(async (resolve) => {
                const isValid = await bcrypt.compare(req.body.password.trim(), account.password)

                if (isValid) {
                    if (account.isVerified == 0) {
                        sendResponse(401, { message: `Unverified`, e_code: "login_7" });
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
                    sendResponse(401, { message: `Wrong password`, e_code: "login_8" });
                    resolve();
                }
            }).catch(() => {
                sendResponse(500, { message: "Unknown Error", e_code: "login_9" });
            });
        }

        const account: IAccount | undefined | void = await findAccount();
        let user: IUser | undefined | void;
        if (account) user = await findUser(account)
        
        if (account && user) {
            await authorize(account, user);
        }

    }
    else sendResponse(400, { message: "Malformed request:", data: req.body });
}