import { IPasswordResetToken } from "@/models/newDbModels/passwordresettoken.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "passwordResetToken";

export async function insertPasswordToken(token: IPasswordResetToken, connectionToUse?: PoolConnection): Promise<number>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, [token], connectionToUse);
}

export async function replacePasswordToken(oldToken: IPasswordResetToken, newToken: IPasswordResetToken, connectionToUse?: PoolConnection): Promise<number>;
export async function replacePasswordToken(oldTokenId: number, newToken: IPasswordResetToken, connectionToUse?: PoolConnection): Promise<number>;
export async function replacePasswordToken(arg1: IPasswordResetToken | number, newToken: IPasswordResetToken, connectionToUse?: PoolConnection): Promise<number>
{
    await removeItemFromDatabase(arg1, TABLE, connectionToUse);

    return await insertPasswordToken(newToken, connectionToUse);
}