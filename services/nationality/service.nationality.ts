import database from "@/functions/utils/mysql";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";
import { PoolConnection } from "mysql";

const TABLE = "nationality";

export async function getNationalities(from: number = 0, limit: number = 200, connectionToUse?: PoolConnection) : Promise<INationality[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<INationality[]>(queryString, [from, limit], connectionToUse);
}

export async function getNationality(id: number, connectionToUse?: PoolConnection) : Promise<INationality | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE id=?;`

    return await executeSelectQuery<INationality>(queryString, id, connectionToUse);
}