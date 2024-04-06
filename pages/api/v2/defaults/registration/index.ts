import {configuration} from '@/private/app.config';
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const response = {
        fromDate: configuration.registration.start,
        toDate: configuration.registration.end,
        serverDate: new Date()
    }

    res.status(200).json(response);
}
