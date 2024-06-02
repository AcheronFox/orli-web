import { IRoom } from "@/models/newDbModels/room.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
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

export async function getFreeRooms(from: number = 0,
    limit: number = MAX_NUM_OF_ROOMS, connectionToUse?: PoolConnection): Promise<IRoom[] | undefined>
{
const query = `SELECT r.*
                FROM ${TABLE} r 
                LEFT JOIN 
	                (SELECT roomId, COUNT(id) as "CNT"
                    FROM accomodation
                    GROUP BY roomId) a ON a.roomId = r.id 
                WHERE a.CNT < r.size LIMIT ?, ?;`;

return await executeSelectQuery<IRoom[]>(query, [from, limit], connectionToUse);
}

export async function getRoommateNamesByRoomId(roomId: number, attendeeId: number, from: number = 0,
    limit: number = MAX_NUM_OF_ROOMS, connectionToUse?: PoolConnection): Promise<IFursona[] | undefined>
{
const query = `SELECT fur.*
                FROM room roo
                LEFT JOIN accomodation acc ON acc.roomId = roo.id
                LEFT JOIN attendee att on att.accomodationId = acc.id
                LEFT JOIN fursona fur on fur.id = att.fursonaId
                WHERE roo.id = ? and att.id != ? LIMIT ?, ?;`;

return await executeSelectQuery<IFursona[]>(query, [roomId, attendeeId, from, limit], connectionToUse);
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