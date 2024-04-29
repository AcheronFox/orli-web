import { IFursona } from "@/models/newDbModels/fursona.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "fursona";

export async function insertFursona(fursona: IFursona, connectionToUse?: PoolConnection): Promise<number>
{
    const query = "INSERT INTO ${TABLE} SET ?;"

    return await executeInsertQuery(query, [fursona], connectionToUse);
}