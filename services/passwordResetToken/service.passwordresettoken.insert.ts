import { IPasswordResetToken } from "@/models/newDbModels/passwordresettoken.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "passwordResetToken";

export async function insertPasswordToken(token: IPasswordResetToken): Promise<number>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, [token]);
}

export async function replacePasswordToken(oldToken: IPasswordResetToken, newToken: IPasswordResetToken): Promise<number>;
export async function replacePasswordToken(oldTokenId: number, newToken: IPasswordResetToken): Promise<number>;
export async function replacePasswordToken(arg1: IPasswordResetToken | number, newToken: IPasswordResetToken): Promise<number>
{
    await removeItemFromDatabase(arg1, TABLE);

    return await insertPasswordToken(newToken);
}