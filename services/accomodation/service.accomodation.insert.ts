import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "accomodation";

export async function insertAccomodation(accomodation: IAccomodation): Promise<number>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, [accomodation]);
}