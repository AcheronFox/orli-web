import { IFursona } from "@/models/newDbModels/fursona.model";
import { IFursonaUpdatable } from "@/models/newDbModels/updateModels/updatable.fursona.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import { PoolConnection } from "mysql";

const TABLE: string = "fursona";

export async function updateFursona(fursona: IFursona, connectionToUse?: PoolConnection): Promise<number>
{
    let updatable: IFursonaUpdatable = {
        name: fursona.name,
        species: fursona.species,
        pathToPictureFile: fursona.pathToPictureFile,
        hasFursuit: fursona.hasFursuit
    }

    const query: string = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [updatable, fursona.id], connectionToUse);
}

export async function removeFursonaPicture(fursonaId: number, connectionToUse?: PoolConnection): Promise<number>
{
    const query: string = `UPDATE ${TABLE} SET pathToPictureFile = '' WHERE id = ?;`;

    return await executeUpdateQuery(query, [fursonaId], connectionToUse);
}