import dbPrisma from "@/database/DatabaseClient";
import { nationality } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'GET')
    {
        const testNat : nationality | null = await dbPrisma.nationality.findFirst(
            {
            where: {
                id: req.body["id"]
            }});

        if (testNat === null)
        {
            res.status(404).json({ error: "Nationality not found!" });
            return;
        }
        res.json(testNat);
    }
}