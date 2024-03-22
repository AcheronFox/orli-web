import { NextApiRequest, NextApiResponse } from "next";
import { INationality } from "@/models/newDbModels/nationality.model";
import { getNationalities } from "@/services/nationality/service.nationality";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INationality[] | string | undefined>)
{
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 200;

    try {
        const nationalities = await getNationalities(from, limit);
        res.status(200).json(nationalities);
    } catch (e)
    {
        console.error(e);
        res.status(500).send("Internal server error.");
    }
    res.status(500).send("Internal server error.");
}
