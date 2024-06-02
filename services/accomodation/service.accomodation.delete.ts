import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";
import { PoolConnection } from "mysql";

const TABLE: string = "accomodation";

export async function removeAccomodation(accomodation: IAccomodation, connectionToUse?: PoolConnection): Promise<boolean>;
export async function removeAccomodation(accomodationId: number, connectionToUse?: PoolConnection): Promise<boolean>;
export async function removeAccomodation(arg1: IAccomodation | number, connectionToUse?: PoolConnection): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE, connectionToUse);
}