import { IPasswordResetToken } from "@/models/newDbModels/passwordresettoken.model";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import console from "console";

const TABLE: string = "passwordResetToken"

export async function selectToken(token: string): Promise<IPasswordResetToken | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE token = ?;`;

    return await executeSelectQuery<IPasswordResetToken>(query, [token]);
}

export async function selectTokenById(id: number): Promise<IPasswordResetToken | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IPasswordResetToken>(query, [id]);
}

export async function checkIfTokenIsValid(id: number): Promise<boolean>;
export async function checkIfTokenIsValid(token: string): Promise<boolean>;
export async function checkIfTokenIsValid(arg1: number | string): Promise<boolean>
{
    let query: string = `SELECT * FROM ${TABLE} WHERE `;

    const selectBy: number | string | undefined = typeof arg1 == 'number' ? arg1 : arg1;

    if (selectBy == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    let token = null;

    query += (typeof selectBy === 'number') ? "id = ?;" : "token = ?;";

    token = await executeSelectQuery<IPasswordResetToken>(query, [selectBy]);

    if (token == null)
        return false;

    const curSeconds: number = (new Date()).getSeconds();

    return curSeconds < token.tokenExpireTime;
}