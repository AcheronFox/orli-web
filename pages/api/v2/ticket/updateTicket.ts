import { setTicketPaymentStatus, setTicketPaymentMethod } from "@/services/ticket/service.ticket.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import { getNationality } from "@/services/nationality/service.nationality";
import { findTemplate, sendMail } from "@/functions/mail/mail-controller";
import handlebars from "handlebars";
import { getAttendeeByAccountKey, getAttendeeById } from "@/services/attendee/service.attendee.select";
import { getFursona } from "@/services/fursona/service.fursona.select";
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
        if ("id" in req.body.params && "paymentStatus" in req.body.params && "paymentMethod" in req.body.params) {
            const requestId = getRequestPropertyAsNumber(req.body.params.id);
            const requestPaymentStatus = req.body.params.paymentStatus;
            let requestPaymentMethod;
            if (req.body.params.paymentMethod === undefined){
                requestPaymentMethod = "";
            } else {
                requestPaymentMethod = req.body.params.paymentMethod;
            }
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const paymentMethodResult = await setTicketPaymentMethod(requestId, requestPaymentMethod);
            if (paymentMethodResult === undefined)
                return res.status(404).json({ message: "Item not updated", e_code: "nat_02" });

            const paymentStatusResult = await setTicketPaymentStatus(requestId, requestPaymentStatus);
            if (paymentStatusResult === undefined)
                return res.status(404).json({ message: "Item not updated", e_code: "nat_02" });

            const attendee = await getAttendeeById(requestId)
            const fursona = await getFursona(attendee?.fursonaId!)

            if (requestPaymentStatus === true && attendee && fursona){
                // EMAIL
                try {
                    const nat = await getNationality(attendee!.nationalityId!)
                    const props = await findTemplate(nat?.iso2!, 'paymentConf')
                    
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

            return res.status(200).json(paymentStatusResult);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}