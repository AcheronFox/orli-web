// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import { verifyScript } from '@/functions/auth/veryifToken';
import { IFood } from '@/models/food.model';
import i18n from '@/i18n';


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
        interface CustomFoodDataInterface {[index: number]: IFood[];}
        if (!req.body.locale) {
            sendResponse(400, {message: "Please provide locale prop.", e_code: "food_script_1"})
        }

        try {
            const foodTable: CustomFoodDataInterface = require(`@/root/locales/${req.body.locale}.food.json`)
            sendResponse(200, foodTable);
        }
        catch {
            sendResponse(400, {message: `Cannot find locale: ${req.body.locale}\nAvailable locales: ${i18n.i18n.languages}`, e_code: "food_script_2"})
        }
    } else return
}