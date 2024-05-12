import { getTicketById } from "@/services/ticket/service.ticket.select";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    try {
        if ("id" in req.query) {
            const requestId = getRequestPropertyAsNumber(req.query.id);
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request" });

            const ticket = await getTicketById(requestId);
            if (ticket === undefined)
                return res.status(404).json({ message: "Item not found" });

            return res.status(200).json(ticket);
        } else {
            return res.status(404).json({ message: "Item not found" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error." });
    }
}
