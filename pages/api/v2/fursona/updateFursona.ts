import { removeFursonaPicture } from "@/services/fursona/service.fursona.update";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'POST')) {
        return;
    }
    
    try {
        if ("id" in req.body.params) {
            const requestId = getRequestPropertyAsNumber(req.body.params.id);
            if (requestId === undefined)
                return res.status(400).json({ message: "Invalid request", e_code: "nat_01" });

            const result = await removeFursonaPicture(requestId);
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