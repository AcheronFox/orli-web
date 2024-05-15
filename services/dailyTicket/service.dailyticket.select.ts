import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import {executeSelectQuery, getDateObjectInIsoFormat, getTodayInIsoFormat} from "@/functions/utils/databaseHelpers";
import console from "console";
import { PoolConnection } from "mysql";

const TABLE: string = "dailyTicket";
const MAX_NUM_OF_DAILY_TICKETS: number = 500; // No way it's that high but w/e

export async function getAllDailyTickets(from: number = 0,
                                         limit: number = MAX_NUM_OF_DAILY_TICKETS, connectionToUse?: PoolConnection): Promise<IDailyTicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IDailyTicket[]>(query, [from, limit], connectionToUse);
}

export async function getValidDailyTickets(from: number = 0,
                                              limit: number = MAX_NUM_OF_DAILY_TICKETS, connectionToUse?: PoolConnection): Promise<IDailyTicket[] | undefined>
{
    // I wonder if this will ever be used to validate someone's ticket. Probably not.
    const curDate = new Date();

    const query = `SELECT * FROM ${TABLE} WHERE currentValidity = ? LIMIT ?, ?;`;

    return await executeSelectQuery<IDailyTicket[]>(query, [curDate, from, limit], connectionToUse);
}

export async function checkDailyTicketValidity(dailyTicket: IDailyTicket, connectionToUse?: PoolConnection): Promise<boolean>;
export async function checkDailyTicketValidity(dailyTicketId: number, connectionToUse?: PoolConnection): Promise<boolean>;
export async function checkDailyTicketValidity(arg1: IDailyTicket | number, connectionToUse?: PoolConnection): Promise<boolean>
{
    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    const value = await executeSelectQuery<IDailyTicket>(query, [id], connectionToUse);

    if (value == undefined)
        return false;

    const ticketDateAsString = getDateObjectInIsoFormat(value.currentValidity);
    const currentDateAsString = getTodayInIsoFormat();

    return ticketDateAsString == currentDateAsString;
}

export async function getDailyTicketById(dailyTicketId: number, connectionToUse?: PoolConnection): Promise<IDailyTicket | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IDailyTicket>(query, dailyTicketId, connectionToUse);
}