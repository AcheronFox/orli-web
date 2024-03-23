import database from "@/functions/utils/mysql";
import { executeInsertQuery } from "@/functions/utils/databaseHelpers";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { INationality } from "@/models/newDbModels/nationality.model";

const TABLE: string = "attendee";

export async function postAttendee(attendee: IAttendee) : Promise<number>
{
    const insertString = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(insertString, attendee);
}



