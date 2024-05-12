import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import {ITicket} from "@/models/newDbModels/ticket.model";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "ticket";

export async function removeTicket(ticket: ITicket, connectionToUse?: PoolConnection): Promise<boolean | undefined>;
export async function removeTicket(ticketId: number, connectionToUse?: PoolConnection): Promise<boolean | undefined>;
export async function removeTicket(arg1: ITicket | number, connectionToUse?: PoolConnection): Promise<boolean | undefined>
{
    return await removeItemFromDatabase(arg1, TABLE, connectionToUse);
}