import { getRoomById } from "@/services/room/service.room.select";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import verifyToken from "@/functions/auth/veryifToken";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
import { getAttendeeByAccountKey } from "@/services/attendee/service.attendee.select";
import { isAdminAccount } from "../../admin/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const tokenPayload = await verifyToken(req, res);

    if (tokenPayload) {
        const account: IAttendee | undefined = await getAttendeeByAccountKey(tokenPayload.accountKey);
        if (account) {
            if (!await isAdminAccount(account)) return res.status(401).json({ message: "Unauthorized" });
        } else return res.status(401).json({ message: "Unauthorized" });
    } else return res.status(401).json({ message: "Unauthorized" });

    try {
        if ("id" in req.query) {
            const requestId = getRequestPropertyAsNumber(req.query.id);
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request" });

            const room = await getRoomById(requestId);
            if (room === undefined)
                return res.status(404).json({ message: "Item not found" });

            return res.status(200).json(room);
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error." });
    }
}
