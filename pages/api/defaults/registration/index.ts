// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';

const regDates = {
    from: new Date(2023, 0, 1),
    to: new Date(2023, 5, 18)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const response = {
        fromDate: regDates.from,
        toDate: regDates.to,
        serverDate: new Date(),
    }

    sendResponse(200, response);
}

export {regDates}