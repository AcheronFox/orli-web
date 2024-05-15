import { getAttendees, getAttendeeById, getAttendeeByAccountKey } from "@/services/attendee/service.attendee.select";
import { changeAttendeeVerification } from "@/services/attendee/service.attendee.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import verifyToken from "@/functions/auth/veryifToken";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { isAdminAccount } from "../../admin/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'POST')) {
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
        if ("id" in req.body) {
            const requestId = getRequestPropertyAsNumber(req.body.id);
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const result = await changeAttendeeVerification(requestId, false);
            if (result === undefined)
                return res.status(404).json({ message: "Item not updated", e_code: "nat_02" });

            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}