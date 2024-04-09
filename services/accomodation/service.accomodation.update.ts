import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import {IAccomodationUpdatable} from "@/models/newDbModels/updateModels/updatable.accomodation.model";

const TABLE: string = "accomodation";

export async function updateAccomodation(accomodation: IAccomodation): Promise<number | undefined>
{
    let updatable: IAccomodationUpdatable = {
        ownerContact: accomodation.ownerContact,
        isOwner: accomodation.isOwner,
        roomId: accomodation.roomId,
    }

    const query = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [updatable, accomodation.id]);
}