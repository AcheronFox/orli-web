import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import {IAccomodationUpdatable} from "@/models/newDbModels/updateModels/updatable.accomodation.model";
import { clearPinAndCustomName } from "../room/service.room.update";

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

export async function leaveRoomFromAccomodation(accomodation: IAccomodation, occupants: IAccomodation[]): Promise<number | undefined>
{
    if (accomodation.roomId == undefined) {
        return 0;
    }

    if (accomodation.isOwner == false) {
        if (occupants.length <= 1) {
            await clearPinAndCustomName(accomodation.roomId);
        }
        return await leaveRoom(accomodation);
    }

    if (occupants.length > 1) {
        occupants = occupants.filter(function(arr) {
            return arr.id !== accomodation.id;
        });
        resolveAdminReassign(occupants);
        leaveRoom(accomodation);
    }
}

export async function resolveAdminReassign(occupants: IAccomodation[])
{
    
    
}

async function leaveRoom(accomodation: IAccomodation): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET roomId = NULL WHERE id = ?;`;
    return await executeUpdateQuery(query, [accomodation.id]);
}

