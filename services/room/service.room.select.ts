import { IRoom } from "@/models/newDbModels/room.model";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "room";
const MAX_NUM_OF_ROOMS: number = 100;

const enum RoomType {
    Facan = "Fácán",
    Vidra = "Vidra",
    Kocsag = "Kócsag"
}

export async function getAllRooms(from: number = 0,
                                  limit: number = MAX_NUM_OF_ROOMS): Promise<IRoom[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IRoom[]>(query, [from, limit]);
}

export async function getRoomBasedOnType(roomType: RoomType): Promise<IRoom[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE building = ?;`;

    return await executeSelectQuery<IRoom[]>(query, [roomType]);
}