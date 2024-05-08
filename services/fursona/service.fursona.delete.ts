import { IFursona } from "@/models/newDbModels/fursona.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "fursona";

export async function removeFursona(attendee: IFursona, connectionToUse?: PoolConnection): Promise<boolean>
export async function removeFursona(attendeeId: number, connectionToUse?: PoolConnection): Promise<boolean>
export async function removeFursona(arg1: IFursona | number, connectionToUse?: PoolConnection): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE, connectionToUse);
}