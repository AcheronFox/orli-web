import { IAttendee } from "@/models/newDbModels/attendee.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "attendee";

// TODO: Once the other services are finished, call them to remove any residual entries.
export async function removeAttendee(attendee: IAttendee, connectionToUse?: PoolConnection): Promise<boolean>;
export async function removeAttendee(attendeeId: number, connectionToUse?: PoolConnection): Promise<boolean>;
export async function removeAttendee(arg1: IAttendee | number, connectionToUse?: PoolConnection): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE, connectionToUse);
}