import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "accomodation";

export async function removeAccomodation(accomodation: IAccomodation): Promise<boolean>;
export async function removeAccomodation(accomodationId: number): Promise<boolean>;
export async function removeAccomodation(arg1: IAccomodation | number): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE);
}