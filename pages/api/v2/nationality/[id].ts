import { NextApiRequest, NextApiResponse } from "next";
import { INationality } from "@/models/newDbModels/nationality.model";
import { getNationality } from "@/services/nationality/service.nationality";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INationality | string | undefined>)
{
    const requestId = req.query.id;

    if (!requestId || isNaN(Number(requestId))) {
        res.status(400).send("Invalid ID, please provide a number");
    }
    
    const requestAsNumber = Number(requestId);

    try {
        const nationalities = await getNationality(requestAsNumber);
        res.status(200).json(nationalities);
    } catch (e)
    {
        res.status(404).send("Item not found");
    }
    res.status(500).send("Internal server error");
}
