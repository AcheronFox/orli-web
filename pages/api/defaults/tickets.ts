// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';


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
        const response = {
            minDate: new Date(2023, 5, 14),
            maxDate: new Date(2023, 5, 18),
        }
    
        sendResponse(200, response);
    } else return;
}