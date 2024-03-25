import { IFursona } from "@/models/newDbModels/fursona.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";

const TABLE: string = "fursona";

export async function removeFursona(attendee: IFursona ): Promise<boolean>
export async function removeFursona(attendeeId: number): Promise<boolean>
export async function removeFursona(arg1: IFursona | number): Promise<boolean>
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