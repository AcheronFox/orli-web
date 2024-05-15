// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/functions/auth/veryifToken';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import { getAttendeeFullDataByAccountKey } from '@/services/attendee/service.attendee.select';
import { destroy } from '@/functions/auth/token-handler';


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
        
        try {
            let response = undefined
            response = await getAttendeeFullDataByAccountKey(tokenPayload.accountKey)
            if (response) {
                sendResponse(200, response);
            }
        }
        catch {
            destroy(res)
            sendResponse(404, {message: "Not Found", e_code: "me_3"});
        } 
    } else return;
}