import {executeUpdateQuery} from "@/functions/utils/databaseHelpers";
import {ITicket} from "@/models/newDbModels/ticket.model";
import {ITicketUpdatable} from "@/models/newDbModels/updateModels/updatable.ticket.model";
import console from "console";
import { PoolConnection } from "mysql";

const TABLE: string = "ticket";

export async function updateTicket(ticket: ITicket, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    let editable: ITicketUpdatable = {
        type: ticket.type,
        earlyArrival: ticket.earlyArrival,
        lateDeparture: ticket.lateDeparture,
        sponsorLevel: ticket.sponsorLevel,
        shirtSize: ticket.shirtSize,
        sponsorPrice: ticket.sponsorPrice,
        totalPrice: ticket.totalPrice,
        paymentMethod: ticket.paymentMethod,
        isPaid: ticket.isPaid,
        foodData: ticket.foodData,
        arrivalDate: ticket.arrivalDate,
        departureDate: ticket.departureDate
    }

    const query: string = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [editable, ticket.id], connectionToUse);
}

export async function setTicketPaymentStatus(ticket: ITicket, isPaid: boolean, connectionToUse?: PoolConnection): Promise<number | undefined>;
export async function setTicketPaymentStatus(ticketId: number, isPaid: boolean, connectionToUse?: PoolConnection): Promise<number | undefined>;
export async function setTicketPaymentStatus(arg1: ITicket | number, isPaid: boolean, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query: string = `UPDATE ${TABLE} SET isPaid = ? WHERE id = ?;`;

    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        const errorMessage = "ID cannot be undefined!";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    return await executeUpdateQuery(query, [isPaid, id], connectionToUse);
}