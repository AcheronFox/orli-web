import { setTicketPaymentStatus, setTicketPaymentMethod } from "@/services/ticket/service.ticket.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'POST')) {
        return;
    }
    
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

            if (requestPaymentStatus === true){
                //ADD EMAIL FUNCTION HERE SOMEWHERE
            }

            return res.status(200).json(paymentStatusResult);
        } else {
            return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Internal server error.", e_code: "nat_04" });
    }
}