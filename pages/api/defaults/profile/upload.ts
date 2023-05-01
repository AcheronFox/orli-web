// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';

const uploadDate = {
    to: new Date(2023, 5, 2)
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
        toDate: uploadDate.to,
    }

    sendResponse(200, response);
}

export {uploadDate}