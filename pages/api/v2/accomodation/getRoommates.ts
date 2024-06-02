import { getRoommateNamesByRoomId } from "@/services/room/service.room.select";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import verifyToken from "@/functions/auth/veryifToken";
import { IAttendee } from "@/models/newDbModels/attendee.model";
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
        if ("roomId" in req.query && "attendeeId" in req.query) {
            const requestRoomId = getRequestPropertyAsNumber(req.query.roomId);
            const requestAttendeeId = getRequestPropertyAsNumber(req.query.attendeeId);
            if (requestRoomId === undefined || requestAttendeeId === undefined)
                return res.status(400).json({ message: "Invalid request" });

            const roommates = await getRoommateNamesByRoomId(requestRoomId, requestAttendeeId);

            if (roommates === undefined)
                return res.status(404).json({ message: "Item not found" });

            let roommateNames:string[] = [];
            roommates.forEach( (element) => {
                roommateNames.push(element.name);
                    });
            return res.status(200).json(roommateNames);
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error." });
    }
}
