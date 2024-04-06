import {configuration} from '@/private/app.config';
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const response = {
        uploadToDate: configuration.profile.uploadToDate,
        serverDate: new Date()
    }

    res.status(200).json(response);
}
