import { IAttendee } from "@/models/newDbModels/attendee.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";

const TABLE: string = "attendee";

// TODO: Once the other services are finished, call them to remove any residual entries.
export async function removeAttendee(attendee: IAttendee): Promise<boolean>;
export async function removeAttendee(attendeeId: number): Promise<boolean>;
export async function removeAttendee(arg1: IAttendee | number): Promise<boolean>
{
    const query: string = `DELETE FROM ${TABLE} WHERE id = ?;`;

    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [id]);

    return result >= 1;
}