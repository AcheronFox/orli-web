import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "accomodation";

export async function insertAccomodation(accomodation: IAccomodation, connectionToUse?: PoolConnection): Promise<number>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, [accomodation], connectionToUse);
}