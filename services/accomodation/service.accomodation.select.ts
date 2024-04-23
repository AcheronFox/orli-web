import { executeSelectQuery } from "@/functions/utils/databaseHelpers";
import { IAccomodation } from "@/models/newDbModels/accomodation.model";

const TABLE: string = "accomodation";
const MAX_NUM_OF_ACCOMODATIONS: number = 500;

export async function getAccomodationById(id: number): Promise<IAccomodation | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IAccomodation>(query, [id]);
}

export async function getAccomodationsByRoomId(roomId: number): Promise<IAccomodation[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE roomId = ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [roomId]);
}

export async function getAllAccomodations(from: number = 0,
                                          limit: number = MAX_NUM_OF_ACCOMODATIONS): Promise<IAccomodation[] | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit]);
}

export async function getAccomodationsBasedOnRoomPresence(hasRoom: boolean, from: number = 0,
                                                limit: number = MAX_NUM_OF_ACCOMODATIONS): Promise<IAccomodation[] | undefined>
{
    let word = hasRoom ? "" : "NOT";
    const query = `SELECT * FROM ${TABLE} WHERE roomId IS ${word} NULL LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit]);
}

export async function getAccomodationsWithOwnerContact(hasContact: boolean, from: number = 0,
                                                       limit: number = MAX_NUM_OF_ACCOMODATIONS): Promise<IAccomodation[] | undefined>
{
    let word = hasContact ? "" : "NOT";
    const query = `SELECT * FROM ${TABLE} WHERE ownerContact IS ${word} NULL LIMIT ?, ?;`;

    return await executeSelectQuery<IAccomodation[]>(query, [from, limit]);
}