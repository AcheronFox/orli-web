import database from "@/functions/utils/mysql";
import { executeDatabaseQuery } from "@/functions/utils/databaseHelpers";
import { INationality } from "@/models/newDbModels/nationality.model";

const TABLE = "nationality";

export async function getNationalities(from: number = 0, limit: number = 200) : Promise<INationality[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeDatabaseQuery<INationality[]>(queryString, [from, limit]);
}

export async function getNationality(id: number) : Promise<INationality | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE id=?;`

    return await executeDatabaseQuery<INationality>(queryString, id);
}