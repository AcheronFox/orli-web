import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";

export async function removeItemFromDatabase(arg1: any, tableName: string)
{
    const query: string = `DELETE FROM ${tableName} WHERE id = ?;`;

    const id: number | undefined = typeof arg1 == 'number' ? arg1 : arg1.id;

    if (id == undefined)
    {
        console.error("ID cannot be undefined!")
        return false;
    }

    const result: number = await executeUpdateQuery(query, [id]);

    return result >= 1;
}