import type { NextApiRequest, NextApiResponse } from 'next'
import * as bcrypt from 'bcrypt';
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { generateJWT } from '@/utils/token-handler';
import { IAccount } from '@/models/account.model';
import { getAccountByEmail } from '@/utils/getData';
import * as jwt from 'jsonwebtoken';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const authorize = async (account: IAccount) => {
        return new Promise<void>(async (resolve) => {
            const isValid = await bcrypt.compare(req.body.password.trim(), account.password)

            if (isValid) {
                if (!account.isAdmin) {
                    sendResponse(401, { message: `Unauthorized`, e_code: "auth_script_1" });
                    resolve();
                }
                else {
                    const customSignOptions: jwt.SignOptions = {
                        issuer: process.env.JWT_ISSUER,
                        audience: process.env.DOMAIN_ROOT,
                        expiresIn: "10m",
                        algorithm: "RS256"
                    }
                    const token = generateJWT("access", account.AccountKey, customSignOptions)
                    sendResponse(200, {"accessToken": token})
                    resolve();
                }
            }
            else {
                sendResponse(401, { message: `Wrong password`, e_code: "auth_script_2" });
                resolve();
            }
        }).catch(() => {
            sendResponse(500, { message: "Unknown Error", e_code: "auth_script_3" });
        });
    }

    const account: IAccount | undefined = await getAccountByEmail(req.body.email.toLowerCase());
    if (account) {
        await authorize(account);
    }
}