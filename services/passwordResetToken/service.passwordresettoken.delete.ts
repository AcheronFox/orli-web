import { IPasswordResetToken } from "@/models/newDbModels/passwordresettoken.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "passwordResetToken";

export async function removePasswordResetToken(token: IPasswordResetToken, connectionToUse?: PoolConnection): Promise<boolean>
export async function removePasswordResetToken(tokenId: number, connectionToUse?: PoolConnection): Promise<boolean>
export async function removePasswordResetToken(arg1: IPasswordResetToken | number, connectionToUse?: PoolConnection): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE, connectionToUse);
}