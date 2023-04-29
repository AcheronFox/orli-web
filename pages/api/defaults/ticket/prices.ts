import { IPrices } from '../../../../models/prices.model';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import verifyToken from '@/utils/veryifToken';
import isMethodAllowed from '@/utils/isMethodAllowed';
import { getEarlyBirdExpDate } from '.';

const prices = {
    earlyBird: {
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
    },
    normal: {
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

const getPrices = (dateToCalculate: Date) => {
    let response = undefined
    if (dateToCalculate.valueOf() < getEarlyBirdExpDate().valueOf()) {
        //Early bird
        response = prices.earlyBird
    }
    else {
        //Normal
        response = prices.normal
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
        const normal: IPrices = prices.normal
        const respPrices: IPrices = getPrices(new Date())
        
        let response: {prices: IPrices; normal: IPrices | null} = {
            prices: respPrices,
            normal: null
        }

        if (JSON.stringify(normal) != JSON.stringify(respPrices)) {
            response.normal = normal
        }
    
        sendResponse(200, response);
    } else return;
}

export {getPrices}