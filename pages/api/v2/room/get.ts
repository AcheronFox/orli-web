import type {NextApiRequest, NextApiResponse} from "next";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import {IRoom} from "@/models/newDbModels/room.model";
import { getAllRooms } from "@/services/room/service.room.select";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 200;

    try {
        const rooms = await getAllRooms(from, limit);
        res.status()
    } catch (e) {

    }

}