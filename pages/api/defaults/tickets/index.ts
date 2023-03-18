// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';


const getEarlyBirdExpDate = () => {
    // MONTH STARTS FROM 0
    return new Date(2023, 3, 1)
}
const getStartDate = () => {
    return new Date(2023, 5, 14)
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
            minDate: getStartDate(),
            maxDate: new Date(2023, 5, 18),
            serverDate: new Date(),
            earlyBirdExpDate: getEarlyBirdExpDate()
        }
    
        sendResponse(200, response);
    } else return;
}

export {getEarlyBirdExpDate, getStartDate}