import { IFursona } from "@/models/newDbModels/fursona.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "fursona";

export async function insertFursona(fursona: IFursona): Promise<number>
{
    const query = "INSERT INTO ${TABLE} SET ?;"

    return executeInsertQuery(query, [fursona]);
}