import { IRoom } from "@/models/newDbModels/room.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "room";

export async function setCustomName(roomId: number, roomName: string, empty: boolean = false, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    let query = `UPDATE ${TABLE} SET customName = ? WHERE `;

    query += empty? "id = NULL;" : "id = ?;";

    return await executeUpdateQuery(query, [roomName, roomId], connectionToUse);
}

export async function setPin(roomId: number, pin: number, empty: boolean = false, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    let query = `UPDATE ${TABLE} SET pin = ? WHERE `;

    query += empty? "id = NULL;" : "id = ?;";

    return await executeUpdateQuery(query, [pin, roomId], connectionToUse);
}

export async function clearPinAndCustomName(roomId: number, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET pin = NULL, customName = NULL WHERE id = ?;`;

    return await executeUpdateQuery(query, [roomId], connectionToUse);
}