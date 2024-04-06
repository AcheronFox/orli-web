import { ITicket } from "@/models/newDbModels/ticket.model";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "ticket";
const MAX_NUM_OF_TICKETS: number = 500;

const enum ShirtSize {
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL",
    XXXL = "XXXL"
}

const enum PaymentMethod {
    Bank= "Bank",
    PayPal = "PayPal",
    Revolut = "Revolut",
}

const enum SponsorLevel {
    None = "None",
    Regular = "Regular",
    Super = "Super"
}

export async function getAllTickets(from: number = 0,
                                    limit: number = MAX_NUM_OF_TICKETS) : Promise<ITicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<ITicket[]>(query, [from, limit]);
}

export async function getTicketsBasedOnPaymentStatus(hasBeenPaid: boolean,
                                                     from: number = 0,
                                                     limit: number = MAX_NUM_OF_TICKETS) : Promise<ITicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE isPaid = ? LIMIT ?, ?;`;

    return await executeSelectQuery<ITicket[]>(query, [hasBeenPaid, from, limit]);
}

export async function getTicketsBasedOnPaymentMethod(paymentMethod: PaymentMethod,
                                                     from: number = 0,
                                                     limit: number = MAX_NUM_OF_TICKETS) : Promise<ITicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE paymentMethod = ? LIMIT ?, ?;`;

    return await executeSelectQuery<ITicket[]>(query, [paymentMethod, from, limit]);
}

export async function getTicketsBasedOnSponsorLevel(sponsorLevel: SponsorLevel,
                                                    from: number = 0,
                                                    limit: number = MAX_NUM_OF_TICKETS): Promise<ITicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE sponsorLevel = ? LIMIT ?, ?;`;

    return await executeSelectQuery<ITicket[]>(query, [sponsorLevel, from, limit]);
}

export async function getTicketsBasedOnShirtSize(shirtSize: ShirtSize,
                                                 from: number = 0,
                                                 limit: number = MAX_NUM_OF_TICKETS): Promise<ITicket[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE shirtSize = ? LIMIT ?, ?;`;

    return await executeSelectQuery<ITicket[]>(query, [shirtSize, from, limit]);
}