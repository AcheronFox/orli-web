import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import {IDailyTicketUpdatable} from "@/models/newDbModels/updateModels/updatable.dailyticket.model";
import { PoolConnection } from "mysql";

const TABLE: string = "dailyTicket";

export async function updateDailyTicket(dailyTicket: IDailyTicket, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    let editable: IDailyTicketUpdatable = {
        currentValidity: dailyTicket.currentValidity,
        pastValidities: dailyTicket.pastValidities
    }

    const query: string = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [editable, dailyTicket.id], connectionToUse);
}