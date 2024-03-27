import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { ITicket } from "@/models/newDbModels/ticket.model";

const TABLE: string = "ticket";

export async function postTicket(ticket: ITicket): Promise<number | undefined>
{
    const query = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(query, ticket);
}