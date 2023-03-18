import { IPrices } from './../../../../models/prices.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';
import { getEarlyBirdExpDate } from '.';


const getPrices = (dateToCalculate: Date) => {
    let response = undefined
    if (dateToCalculate.valueOf() < getEarlyBirdExpDate().valueOf()) {
        response = {
            0: {
                hu: 500,
                eur: 1,
            },
            1: {
                hu: 1000,
                eur: 2,
            },
            2: {
                hu: 1500,
                eur: 3,
            },
            extra0: {
                hu: 250,
                eur: 0.5,
            },
            extra1: {
                hu: 300,
                eur: 0.6,
            },
        }
    }
    else {
        response = {
            0: {
                hu: 1000,
                eur: 1,
            },
            1: {
                hu: 2000,
                eur: 2,
            },
            2: {
                hu: 3000,
                eur: 3,
            },
            extra0: {
                hu: 500,
                eur: 0.5,
            },
            extra1: {
                hu: 600,
                eur: 0.6,
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