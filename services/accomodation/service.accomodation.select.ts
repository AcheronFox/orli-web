import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { PoolConnection } from "mysql";

const TABLE: string = "accomodation";
const MAX_NUM_OF_ACCOMODATIONS: number = 500;

export async function getAccomodationById(id: number, connectionToUse?: PoolConnection): Promise<IAccomodation | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IAccomodation>(query, [id], connectionToUse);
}

export async function getAccomodationsByRoomId(roomId: number, connectionToUse?: PoolConnection): Promise<IAccomodation[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE roomId = ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [roomId], connectionToUse);
}

export async function getAllAccomodations(from: number = 0,
                                          limit: number = MAX_NUM_OF_ACCOMODATIONS, connectionToUse?: PoolConnection): Promise<IAccomodation[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit], connectionToUse);
}

export async function getAccomodationMaxId(from: number = 0,
    limit: number = MAX_NUM_OF_ACCOMODATIONS, connectionToUse?: PoolConnection): Promise<number | undefined>
{
const query = `SELECT MAX(id) as "ID" FROM ${TABLE} LIMIT ?, ?;`;

return await executeSelectQuery<number>(query, [from, limit], connectionToUse);
}

export async function getAccomodationsBasedOnRoomPresence(hasRoom: boolean, from: number = 0,
                                                limit: number = MAX_NUM_OF_ACCOMODATIONS, connectionToUse?: PoolConnection): Promise<IAccomodation[] | undefined>
{
    let word = hasRoom ? "" : "NOT";
    const query = `SELECT * FROM ${TABLE} WHERE roomId IS ${word} NULL LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit], connectionToUse);
}

export async function getAccomodationsWithOwnerContact(hasContact: boolean, from: number = 0,
                                                       limit: number = MAX_NUM_OF_ACCOMODATIONS, connectionToUse?: PoolConnection): Promise<IAccomodation[] | undefined>
{
    let word = hasContact ? "" : "NOT";
    const query = `SELECT * FROM ${TABLE} WHERE ownerContact IS ${word} NULL LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit], connectionToUse);
}

export async function getAccomodationByAccountKey(accountKey: string, connectionToUse?: PoolConnection): Promise<IAccomodation | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id IN (SELECT accomodationId FROM attendee WHERE accountKey = ?);`;

    return await executeSelectQuery<IAccomodation>(query, [accountKey], connectionToUse);
}