import database from "@/functions/utils/mysql";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { INationality } from "@/models/newDbModels/nationality.model";

const TABLE: string = "attendee";
const MAX_NUM_OF_ATTENDEES: number = 500;

const enum AttendeeType {
    Admin,
    Staff,
    Verified,
    Unverified
}

export async function getAttendees(from: number = 0,
                                   limit: number = MAX_NUM_OF_ATTENDEES) : Promise<IAttendee[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, [from, limit]);
}

export async function getAttendeeById(id: number) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, id);
}

export async function getAttendeeByAccountKey(accountKey: string) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE accountKey = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, accountKey);
}

export async function getAttendeeByEmail(email: string) : Promise<IAttendee | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE email = ?;`;

    return await executeSelectQuery<IAttendee>(queryString, email);
}

export async function getAttendeesByType(attendeeType: AttendeeType, from: number = 0,
                                         limit: number = MAX_NUM_OF_ATTENDEES) : Promise<IAttendee[] | undefined>
{
    const fieldMap = {
        [AttendeeType.Admin]: ' admin = 1 ',
        [AttendeeType.Staff]: ' staff = 1 ',
        [AttendeeType.Verified]: ' verified = 1 ',
        [AttendeeType.Unverified]: ' verified = 0 '
    };

    const field = fieldMap[attendeeType];

    const queryString = `SELECT * FROM ${TABLE} WHERE ${field} LIMIT ?, ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, [from, limit]);
}

export async function getAttendeeByNationality(nationality: INationality, from: number = 0,
                                               limit: number = MAX_NUM_OF_ATTENDEES) : Promise<IAttendee[] | undefined>
{
    const queryString = `SELECT * FROM ${TABLE} WHERE nationalityId = ?;`;

    return await executeSelectQuery<IAttendee[]>(queryString, nationality.id);
}
