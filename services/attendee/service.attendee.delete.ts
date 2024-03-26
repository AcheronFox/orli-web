import { IAttendee } from "@/models/newDbModels/attendee.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "attendee";

// TODO: Once the other services are finished, call them to remove any residual entries.
export async function removeAttendee(attendee: IAttendee): Promise<boolean>;
export async function removeAttendee(attendeeId: number): Promise<boolean>;
export async function removeAttendee(arg1: IAttendee | number): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE);
}