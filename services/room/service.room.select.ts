import { IRoom } from "@/models/newDbModels/room.model";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "room";
const MAX_NUM_OF_ROOMS: number = 100;

const enum RoomType {
    Facan = "Fácán",
    Vidra = "Vidra",
    Kocsag = "Kócsag"
}

export async function getAllRooms(from: number = 0,
                                  limit: number = MAX_NUM_OF_ROOMS, connectionToUse?: PoolConnection): Promise<IRoom[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IRoom[]>(query, [from, limit], connectionToUse);
}

export async function getRoomBasedOnType(roomType: RoomType, connectionToUse?: PoolConnection): Promise<IRoom[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE building = ?;`;

    return await executeSelectQuery<IRoom[]>(query, [roomType], connectionToUse);
}

export async function getRoomById(roomId: number, connectionToUse?: PoolConnection): Promise<IRoom | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IRoom>(query, [roomId], connectionToUse);
}