// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';

const ticketDates = {
    from: new Date(2023, 0, 1),
    to: new Date(2023, 5, 18)
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
        const response = {
            fromDate: ticketDates.from,
            toDate: ticketDates.to,
            serverDate: new Date(),
        }
    
        sendResponse(200, response);
    } else return;
}

export {ticketDates}