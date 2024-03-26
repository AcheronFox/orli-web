import { IPasswordResetToken } from "@/models/newDbModels/passwordresettoken.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import console from "console";
import {removeItemFromDatabase} from "@/services/universal/service.universal.deleteItem";

const TABLE: string = "passwordResetToken";

export async function removePasswordResetToken(token: IPasswordResetToken ): Promise<boolean>
export async function removePasswordResetToken(tokenId: number): Promise<boolean>
export async function removePasswordResetToken(arg1: IPasswordResetToken | number): Promise<boolean>
{
    return await removeItemFromDatabase(arg1, TABLE);
}