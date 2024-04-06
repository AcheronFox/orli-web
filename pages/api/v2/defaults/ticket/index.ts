import {configuration} from '@/private/app.config';
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const serverDate = new Date();
    const isOpen = serverDate >= configuration.ticket.dates.start && serverDate < configuration.ticket.dates.end;
    const isEarlyBird = serverDate < configuration.ticket.dates.earlyBirdEnd;

    const response = {
        isOpen: isOpen,
        isEarlyBird: isEarlyBird,
        dates: configuration.ticket.dates,
        extraPrices: configuration.ticket.extraPrices,
        types: configuration.ticket.types,
        serverDate: serverDate
    }

    res.status(200).json(response);
}
