import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';
import verifyToken from '@/functions/auth/veryifToken';
import { IAttendee } from '@/models/newDbModels/attendee.model';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';

const isAdminAccount = async (account: IAttendee) => {
    return account.admin;
}

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
        const account: IAttendee | undefined = await getAttendeeByAccountKey(tokenPayload.accountKey);
        if (account) {
            if (await isAdminAccount(account)) {
                return sendResponse(200, {message: "Authentication Successful"})
            }
            else {
                return sendResponse(401, {message: "Authentication Failed", e_code: 'admin_auth_1'})
            }
        } else {
            return sendResponse(404, {message: "Account Not Found", e_code: 'admin_auth_2'})
        }
    } else return
}

export {isAdminAccount}