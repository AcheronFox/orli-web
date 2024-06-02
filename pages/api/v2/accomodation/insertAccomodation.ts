import { changeAttendeeAccomodationId } from "@/services/attendee/service.attendee.update";
import { getAccomodationMaxId } from "@/services/accomodation/service.accomodation.select";
import { insertAccomodation } from "@/services/accomodation/service.accomodation.insert";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import verifyToken from "@/functions/auth/veryifToken";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { getAttendeeByAccountKey } from "@/services/attendee/service.attendee.select";
import { isAdminAccount } from "../../admin/auth";
import { format } from 'date-fns'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'PUT')) {
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
        if ("attendeeId" in req.body.params && "roomId" in req.body.params) {
            const requestId = getRequestPropertyAsNumber(req.body.params.attendeeId);
            const requestRoomId = getRequestPropertyAsNumber(req.body.params.roomId)
            if (requestId === undefined || requestRoomId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const accommodationMaxId = await getAccomodationMaxId();
            const newAccommodationId = (accommodationMaxId === undefined) ? 1 : JSON.parse(JSON.stringify(accommodationMaxId)).ID + 1

            const result = await insertAccomodation({
                id: newAccommodationId,
                createdAt: format(Date.now(), 'yyyy-MM-dd hh:mm:ss'),
                ownerContact: undefined,
                isOwner: false,
                roomId: requestRoomId})

            const attendeeUpdate = await changeAttendeeAccomodationId(requestId, newAccommodationId);

            if (attendeeUpdate === undefined || result === undefined)
                return res.status(404).json({ message: "Item not updated", e_code: "nat_02" });

            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}