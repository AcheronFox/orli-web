import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { ITicket } from "@/models/newDbModels/ticket.model";
import { PoolConnection } from "mysql";

const TABLE: string = "ticket";

export async function insertTicket(ticket: ITicket, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, ticket, connectionToUse);
}