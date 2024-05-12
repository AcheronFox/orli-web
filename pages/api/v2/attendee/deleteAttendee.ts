import { getAttendees, getAttendeeById } from "@/services/attendee/service.attendee.select";
import { removeAttendee } from "@/services/attendee/service.attendee.delete";
import { removeFursona } from "@/services/fursona/service.fursona.delete";
import { removeTicket } from "@/services/ticket/service.ticket.delete";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'DELETE')) {
        return;
    }

    try {
        if ("id" in req.body) {
            const requestId = getRequestPropertyAsNumber(req.body.id);
            const fursonaId = getRequestPropertyAsNumber(req.body.fursonaId);
            const ticketId = getRequestPropertyAsNumber(req.body.ticketId);
            const attendeeEmail = req.body.attendeeEmail;
            console.log(requestId + " " + fursonaId + " " + ticketId)
            if (requestId === undefined){
                return res.status(400).json({ message: "Invalid request" });
            }
               
            const result = await removeAttendee(requestId);
            if (result === undefined)
                return res.status(404).json({ message: "Attendee not removed", e_code: "nat_02" });

            if (fursonaId !== undefined){
                const fursonaDeleteResult = await removeFursona(fursonaId)
                if (fursonaDeleteResult === undefined){
                    return res.status(404).json({ message: "Fursona not deleted" });
                }
            }

            if (ticketId !== undefined){
                const ticketDeleteResult = await removeTicket(ticketId)
                if (ticketDeleteResult === undefined){
                    return res.status(404).json({ message: "Ticket not deleted" });
                }
            }                

            if (attendeeEmail !== undefined){
                //ADD EMAIL FUNCTION HERE SOMEWHERE
            }            

            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}