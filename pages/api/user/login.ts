import type { NextApiRequest, NextApiResponse } from 'next'
import { ILoginForm } from '@/models/login-form.model';
import { IAccount } from '@/models/account.model';
import { IUser } from '@/models/user.model';
import database from '@/utils/mysql';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import fs from 'fs';
import isMethodAllowed from '@/utils/isMethodAllowed';

const privateKey = fs.readFileSync('private/private.key', 'utf8');

const accessSignOptions: jwt.SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    expiresIn: "12h",
    algorithm: "RS256"
};
const refreshSignOptions: jwt.SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    expiresIn: "2w",
    algorithm: "RS256"
};

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
                database.query(`SELECT * FROM account WHERE email = '${req.body.email}'`, async (err, result) => {
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
                        sendResponse(404, { message: `No user with address: ${req.body.email}`, e_code: "login_5" });
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
                        const payload = {
                            accountKey: account.AccountKey
                        }

                        const publicUserDataPayload = {
                            accountKey: account.AccountKey
                        }

                        const publicToken = jwt.sign(publicUserDataPayload, privateKey, refreshSignOptions)
                        const accessToken = jwt.sign(payload, privateKey, accessSignOptions);
                        const refreshToken = jwt.sign(payload, privateKey, refreshSignOptions);

                        if (req.body.remember) {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                [   
                                    `publicToken=${publicToken}; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                                    `accessToken=${accessToken}; HttpOnly; Max-Age=43200; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                                    `refreshToken=${refreshToken}; HttpOnly; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`
                                ])
                            .json({ ...user })
                            resolve();
                        } else {
                            res.status(200)
                            .setHeader('Set-Cookie',
                                [   
                                    `publicToken=${publicToken}; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                                    `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                                    `refreshToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`
                                ])
                            .json({ ...user })
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