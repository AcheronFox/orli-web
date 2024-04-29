import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { IAttendeeUpdatable } from "@/models/newDbModels/updateModels/updatable.attendee.model";
import * as console from "console";
import { PoolConnection } from "mysql";

const TABLE: string = "attendee";

export async function updateAttendee(attendee: IAttendee, connectionToUse?: PoolConnection) : Promise<number>
{
    let editable: IAttendeeUpdatable = {
        accountKey: attendee.accountKey,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        email: attendee.email,
        password: attendee.password,
        dateOfBirth: attendee.dateOfBirth,
        phone: attendee.phone,
        telegram: attendee.telegram,
        allergy: attendee.allergy,
    }

    const query: string = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [editable, attendee.id], connectionToUse);
}

export async function changeAttendeeVerification(attendee: IAttendee, verified: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeVerification(attendeeId: number, verified: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeVerification(arg1: IAttendee | number, verified: boolean, connectionToUse?: PoolConnection) : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET verified = ? WHERE id = ?;`;

    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [verified, id], connectionToUse);

    return result >= 1;
}

export async function changeAttendeePassword(attendee: IAttendee, newHash: string, newAccountKey: string, connectionToUse?: PoolConnection)
    : Promise<boolean>;
export async function changeAttendeePassword(attendeeId: number, newHash: string, newAccountKey: string, connectionToUse?: PoolConnection)
    : Promise<boolean>;
export async function changeAttendeePassword(arg1: IAttendee | number, newHash: string, newAccountKey: string, connectionToUse?: PoolConnection)
    : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET password = ?, accountKey = ? WHERE id = ?;`;

    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;
    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [newHash, newAccountKey, id], connectionToUse);

    return result >= 1;
}

export async function changeAttendeeStaffStatus(attendee: IAttendee, staffStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeStaffStatus(attendeeId: number, staffStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeStaffStatus(arg1: IAttendee | number, staffStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET staff = ? WHERE id = ?;`;
    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [staffStatus, id], connectionToUse);

    return result >= 1;
}

export async function changeAttendeeAdminStatus(attendee: IAttendee, adminStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeAdminStatus(attendeeId: number, adminStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeAdminStatus(arg1: IAttendee | number, adminStatus: boolean, connectionToUse?: PoolConnection) : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET admin = ? WHERE id = ?;`;
    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [adminStatus, id], connectionToUse);

    return result >= 1;
}

export async function changeAttendeePasswordResetTokenId(attendee: IAttendee, tokenId: number, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeePasswordResetTokenId(attendeeId: number, tokenId: number, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeePasswordResetTokenId(arg1: IAttendee | number, tokenId: number, connectionToUse?: PoolConnection) : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET passwordResetTokenId = ? WHERE id = ?;`;
    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [tokenId, id], connectionToUse);

    return result >= 1;
}

export async function changeAttendeeAccomodationId(attendee: IAttendee, accomodationId: number, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeAccomodationId(attendeeId: number, accomodationId: number, connectionToUse?: PoolConnection) : Promise<boolean>;
export async function changeAttendeeAccomodationId(arg1: IAttendee | number, accomodationId: number, connectionToUse?: PoolConnection) : Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET accomodationId = ? WHERE id = ?;`;
    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!");
        return false;   
    }

    const result: number = await executeUpdateQuery(query, [accomodationId, id], connectionToUse);

    return result >= 1;
}

export async function removeAttendeeAccomodationId(accountKey: string, connectionToUse?: PoolConnection): Promise<boolean>
{
    const query: string = `UPDATE ${TABLE} SET accomodationId = NULL WHERE accountKey = ?;`;

    if (accountKey == undefined) {
        console.error("accountKey cannot be undefined!");
        return false;
    }

    const result: number = await executeUpdateQuery(query, [accountKey], connectionToUse);

    return result >= 1;
}