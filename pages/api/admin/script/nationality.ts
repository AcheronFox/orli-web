// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import { verifyScript } from '@/utils/veryifToken';
import i18n from '@/root/i18n';

type Codes = {
    id: number;
    alpha2: string;
    alpha3: string;
    name: string;
};

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
        if (!req.body.locale) {
            sendResponse(400, {message: "Please provide locale prop.", e_code: "nat_script_1"})
        }

        try {
            const foodTable: Codes = require(`@/root/locales/${req.body.locale}.world.json`)
            sendResponse(200, foodTable);
        }
        catch {
            sendResponse(400, {message: `Cannot find locale: ${req.body.locale}\nAvailable locales: ${i18n.i18n.languages}`, e_code: "nat_script_2"})
        }
    } else return
}