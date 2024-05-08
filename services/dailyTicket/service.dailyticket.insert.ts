import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "dailyTicket";

export async function insertDailyTicket(dailyTicket: IDailyTicket, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, dailyTicket, connectionToUse);
}