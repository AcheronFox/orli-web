// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import { authAdmin } from '@/utils/token-handler';
import { verifyScript } from '@/utils/veryifToken';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return

    const tokenPayload = await verifyScript(req.body.accessToken, res);
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        const isAdmin = await authAdmin(tokenPayload.accountKey)
        if (!isAdmin) return sendResponse(401, "Unauthorized")
        

        sendResponse(200, {"csv": 'success'});
    } else return;
}