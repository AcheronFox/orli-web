import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import {ITicket} from "@/models/newDbModels/ticket.model";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "ticket";

export async function removeTicket(ticket: ITicket): Promise<boolean | undefined>;
export async function removeTicket(ticketId: number): Promise<boolean | undefined>;
export async function removeTicket(arg1: ITicket | number): Promise<boolean | undefined>
{
    return await removeItemFromDatabase(arg1, TABLE);
}