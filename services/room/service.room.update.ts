import { IRoom } from "@/models/newDbModels/room.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "room";

export async function setCustomName(roomId: number, roomName: string): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET customName = ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [roomName, roomId]);
}

export async function setPin(roomId: number, pin: number): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET pin = ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [pin, roomId]);
}