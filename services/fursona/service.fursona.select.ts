import { IFursona } from "@/models/newDbModels/fursona.model";
import { executeSelectQuery } from "@/functions/utils/databaseHelpers";

const TABLE: string = "fursona";
const MAX_NUM_OF_FURSONAS: number = 500;

export async function getAllFursonas(from: number = 0,
                                             limit: number = MAX_NUM_OF_FURSONAS) : Promise<IFursona | undefined>
{
    const query = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

    return await executeSelectQuery<IFursona>(query, [from, limit]);
}

export async function getFursona(id: number): Promise<IFursona | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE id = ?;`;

    return await executeSelectQuery<IFursona>(query, id);
}

export async function getFursonasBasedOnFursuit(hasFursuit: boolean,
                                                        from: number = 0,
                                                        limit: number = MAX_NUM_OF_FURSONAS) : Promise<IFursona | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE hasFursuit = ? LIMIT ?, ?;`;

    return await executeSelectQuery<IFursona>(query, [hasFursuit, from, limit]);
}

export async function getFursonaBasedOnSpecies(species: string,
                                               from: number = 0,
                                               limit: number = MAX_NUM_OF_FURSONAS) : Promise<IFursona | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE species LIKE LOWER(?) LIMIT ?, ?;`;

    // TODO: This is retarded, please fix in the future
    species = '%'+species+'%';
    return await executeSelectQuery<IFursona>(query, [species, from, limit]);
}

export async function getFursonaBasedOnName(name: string,
                                            from: number = 0,
                                            limit: number = MAX_NUM_OF_FURSONAS) : Promise<IFursona | undefined>
{
    const query = `SELECT * FROM ${TABLE} WHERE name LIKE LOWER(?) LIMIT ?, ?;`;
    name = '%'+name+'%';

    return await executeSelectQuery<IFursona>(query, [name, from, limit]);
}