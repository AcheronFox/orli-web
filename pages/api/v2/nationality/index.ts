import { getNationalities, getNationality } from "@/services/nationality/service.nationality";
import { getRequestPropertyAsNumber } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { NextApiRequest, NextApiResponse } from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    try {
        if ("id" in req.query) {
            const requestId = getRequestPropertyAsNumber(req.query.id);

            if (requestId === undefined)
                return res.status(400).json({message: "Invalid request", e_code: "nat_01"});

            const nationality = await getNationality(requestId);
            if (nationality === undefined)
                return res.status(404).json({message: "Item not found", e_code: "nat_02"});

            return res.status(200).json(nationality);
        } else {
            const from = Math.max(0, Number(req.query.from) || 0);
            const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 200));

            const nationalities = await getNationalities(from, limit);

            if (nationalities === undefined)
                return res.status(404).json({message: "Item not found", e_code: "nat_03"});

            return res.status(200).json(nationalities);
        }
    } catch (e) {
        return res.status(500).send({message: "Internal server error.", e_code: "nat_04"});
    }
}
