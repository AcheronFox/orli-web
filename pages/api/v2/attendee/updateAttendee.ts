import { getAttendees, getAttendeeById } from "@/services/attendee/service.attendee.select";
import { changeAttendeeVerification } from "@/services/attendee/service.attendee.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import { getNationality } from "@/services/nationality/service.nationality";
import { findTemplate, sendMail } from "@/functions/mail/mail-controller";
import handlebars from "handlebars";
import { getFursona } from "@/services/fursona/service.fursona.select";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'POST')) {
        return;
    }
    
    try {
        if ("id" in req.body.params && "verifiedStatus" in req.body.params) {
            const requestId = getRequestPropertyAsNumber(req.body.params.id);
            const requestVerifiedStatus = req.body.params.verifiedStatus;
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const result = await changeAttendeeVerification(requestId, requestVerifiedStatus);
            if (result === undefined)
                return res.status(404).json({ message: "Item not updated", e_code: "nat_02" });

            const attendee = await getAttendeeById(requestId)
            const fursona = await getFursona(attendee?.fursonaId!)

            if (requestVerifiedStatus === true && attendee && fursona){
                // EMAIL
                try {
                    const nat = await getNationality(attendee!.nationalityId!)
                    const props = await findTemplate(nat?.iso2!, 'regVerification')
                    
                    if (props) {
                        const template = handlebars.compile(props.mail);
                        const replacements = {
                            fursonaName: fursona.name,
                            loginUrl: `${process.env.DOMAIN_ROOT}login`
                        };

                        const htmlToSend = template(replacements);
                        props.mail = htmlToSend

                        await sendMail({...props, address: attendee.email}, (err: string, result: string) => {
                            if (err) {
                                throw new Error("Failed to send email.")
                            }
                        })
                    }
                    else {
                        throw new Error('Failed to find template or data.')
                    }
                }
                catch (e) {
                    console.log(e)
                    return res.status(500).json({ message: "Failed to send email", e_code: "nat_20" });
                }
            }
            
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}