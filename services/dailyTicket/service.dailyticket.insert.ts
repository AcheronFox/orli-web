import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "dailyTicket";

// TODO: How is this supposed to work anyway?
export async function insertDailyTicket(dailyTicket: IDailyTicket): Promise<number | undefined>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, dailyTicket);
}