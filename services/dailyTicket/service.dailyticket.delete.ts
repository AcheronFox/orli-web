import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "dailyTicket";

export async function removeDailyTicket(attendee: IDailyTicket): Promise<boolean>;
export async function removeDailyTicket(attendeeId: number): Promise<boolean>;
export async function removeDailyTicket(arg1: IDailyTicket | number): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE);
}