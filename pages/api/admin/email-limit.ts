import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import _ from 'lodash';
import { IAccount } from '@/models/account.model';
import { getAccountByKey } from '@/utils/getData';
import verifyToken from '@/utils/veryifToken';
import { isAdminAccount } from './auth';
import database from '@/utils/mysql';
import { IAdminChart } from '@/models/admin.model';
import { getMailLimit } from '@/utils/mail-controller';

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
        const account: IAccount | undefined = await getAccountByKey(tokenPayload.accountKey);
        if (account) {
            if (await isAdminAccount(account)) {
                try {
                    const limit = await getMailLimit()
                    return sendResponse(200, limit)
                }
                catch (e) {
                    console.log(e)
                    return sendResponse(500, {message: "Failed to get limit", e_code: 'admin_e_limit_1'})
                }
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_e_limit_1'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_e_limit_1'})
        }
    } else return
}