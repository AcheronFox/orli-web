import { getAccomodationById } from "@/services/accomodation/service.accomodation.select";
import { enterRoom } from "@/services/accomodation/service.accomodation.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import verifyToken from "@/functions/auth/veryifToken";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { getAttendeeByAccountKey } from "@/services/attendee/service.attendee.select";
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
        if ("accomodationId" in req.body.params && "roomId" in req.body.params) {
            const requestId = getRequestPropertyAsNumber(req.body.params.accomodationId);
            const requestRoomId = getRequestPropertyAsNumber(req.body.params.roomId)
            if (requestId === undefined || requestRoomId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const accomodation = await getAccomodationById(requestId);
            if (accomodation === undefined){
                return res.status(404).json({ message: "Accomodation not found"})
            }

            const result = await enterRoom(accomodation, requestRoomId)
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