import { IPrices } from '../../../../models/prices.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';
import { getEarlyBirdExpDate } from '.';


const getPrices = (dateToCalculate: Date) => {
    let response = undefined
    if (dateToCalculate.valueOf() < getEarlyBirdExpDate().valueOf()) {
        //Early bird
        response = {
            0: {
                hu: 6800,
            },
            1: {
                hu: 14450,
            },
            2: {
                hu: 46750,
            },
            extra0: {
                hu: 5525,
            },
            extra1: {
                hu: 5525,
            },
        }
    }
    else {
        //Normal
        response = {
            0: {
                hu: 8000,
            },
            1: {
                hu: 17000,
            },
            2: {
                hu: 55000,
            },
            extra0: {
                hu: 6500,
            },
            extra1: {
                hu: 6500,
            },
        }
    }
    return response
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
        const response: IPrices = getPrices(new Date())
    
        sendResponse(200, response);
    } else return;
}

export {getPrices}