import database from "@/functions/utils/mysql";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { INationality } from "@/models/newDbModels/nationality.model";
import { IAttendeeFullData } from "@/models/newDbModels/attendeeFullData.model";
import { getAccomodationById } from "../accomodation/service.accomodation.select";
import { getFursona } from "../fursona/service.fursona.select";
import { getNationality } from "../nationality/service.nationality";
import { getRoomById } from "../room/service.room.select";
import { getTicketById } from "../ticket/service.ticket.select";
import { getDailyTicketById } from "../dailyTicket/service.dailyticket.select";
import { PoolConnection } from "mysql";

const TABLE: string = "attendee";
const MAX_NUM_OF_ATTENDEES: number = 500;

const enum AttendeeType {
    Admin,
    Staff,
    Verified,
    Unverified
}

export async function getAttendees(from: number = 0,
                                   limit: number = MAX_NUM_OF_ATTENDEES, connectionToUse?: PoolConnection) : Promise<IAttendee[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, [from, limit], connectionToUse);
}

export async function getAttendeeById(id: number, connectionToUse?: PoolConnection) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, id, connectionToUse);
}

export async function getAttendeeByAccountKey(accountKey: string, connectionToUse?: PoolConnection) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE accountKey = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, accountKey, connectionToUse);
}

export async function getAttendeeByResetToken(resetId: number, connectionToUse?: PoolConnection) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE passwordResetTokenId = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, resetId, connectionToUse);
}

export async function getAttendeeByEmail(email: string, connectionToUse?: PoolConnection) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE email = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, email, connectionToUse);
}

export async function getAttendeesByType(attendeeType: AttendeeType, from: number = 0,
                                         limit: number = MAX_NUM_OF_ATTENDEES, connectionToUse?: PoolConnection) : Promise<IAttendee[] | undefined>
{
    const fieldMap = {
        [AttendeeType.Admin]: ' admin = 1 ',
        [AttendeeType.Staff]: ' staff = 1 ',
        [AttendeeType.Verified]: ' verified = 1 ',
        [AttendeeType.Unverified]: ' verified = 0 '
    };

    const field = fieldMap[attendeeType];

    const queryString = `SELECT * FROM ${TABLE} WHERE ${field} LIMIT ?, ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, [from, limit], connectionToUse);
}

export async function getAttendeeByNationality(nationality: INationality, from: number = 0,
                                               limit: number = MAX_NUM_OF_ATTENDEES, connectionToUse?: PoolConnection) : Promise<IAttendee[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE nationalityId = ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, nationality.id, connectionToUse);
}

export async function getAttendeeFullData(attendeeId: number, connectionToUse?: PoolConnection): Promise<IAttendeeFullData | undefined>
{
    const attendee = await getAttendeeById(attendeeId) as Omit<IAttendee, 'password'>;
    return getAttendeeData(attendee);
}

export async function getAttendeeFullDataByAccountKey(AccountKey: string): Promise<IAttendeeFullData | undefined>
{
    const attendee = await getAttendeeByAccountKey(AccountKey) as Omit<IAttendee, 'password'>;
    return getAttendeeData(attendee);
}

const getAttendeeData = async (attendee: Omit<IAttendee, "password">) => {
    const fursona = await getFursona(attendee.fursonaId);
    const nationality = attendee.nationalityId ? await getNationality(attendee.nationalityId) : undefined;
    const accomodation = attendee.accomodationId ? await getAccomodationById(attendee.accomodationId) : undefined;
    const room = accomodation?.roomId ? await getRoomById(accomodation.roomId) : undefined;
    const ticket = attendee.ticketId ? await getTicketById(attendee.ticketId) : undefined;
    const dailyTicket = attendee.dailyTicketId ? await getDailyTicketById(attendee.dailyTicketId) : undefined;

    let fullData: IAttendeeFullData = {
        attendee: attendee,
        fursona: fursona!,
        nationality: nationality!,
        accomodation: accomodation,
        room: room,
        ticket: ticket,
        dailyTicket: dailyTicket
    };
    return fullData
}