import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { executeUpdateQuery, getDateObjectInIsoFormat, getTodayInIsoFormat } from "@/functions/utils/databaseHelpers";
import {IAccomodationUpdatable} from "@/models/newDbModels/updateModels/updatable.accomodation.model";
import { clearPinAndCustomName } from "../room/service.room.update";
import { removeAccomodation } from "./service.accomodation.delete";
import { getAccomodationsByRoomId } from "./service.accomodation.select";
import { PoolConnection } from "mysql";

const TABLE: string = "accomodation";

export async function updateAccomodation(accomodation: IAccomodation, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    let updatable: IAccomodationUpdatable = {
        ownerContact: accomodation.ownerContact,
        isOwner: accomodation.isOwner,
        roomId: accomodation.roomId,
    }

    const query = `UPDATE ${TABLE} SET ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [updatable, accomodation.id], connectionToUse);
}

export async function makeAccomodationAdmin(accomodationId: number, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET isOwner = 1 WHERE id = ?;`

    return await executeUpdateQuery(query, [accomodationId], connectionToUse);
}

export async function leaveRoom(accomodation: IAccomodation, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    if (accomodation.roomId == undefined) {
        return 0;
    }

    let occupants = await getAccomodationsByRoomId(accomodation.roomId, connectionToUse);
    if (occupants == undefined) {
        return undefined;
    }

    if (accomodation.isOwner == false) {
        if (occupants.length <= 1) {
            await clearPinAndCustomName(accomodation.roomId, connectionToUse);
        }
        return await removeAccomodation(accomodation, connectionToUse) ? 1 : 0;
    }

    if (occupants.length > 1) {
        occupants = occupants.filter(function(arr) {
            return arr.id !== accomodation.id;
        });
        resolveAdminReassign(occupants, connectionToUse);
        return await removeAccomodation(accomodation, connectionToUse) ? 1 : 0;
    }
}

export async function enterRoom(accomodation: IAccomodation, roomId: number, connectionToUse?: PoolConnection): Promise<number | undefined>
{
    const query = `UPDATE ${TABLE} SET roomId = ? WHERE id = ?;`;

    return await executeUpdateQuery(query, [roomId, accomodation.id], connectionToUse);
}

async function resolveAdminReassign(occupants: IAccomodation[], connectionToUse?: PoolConnection)
{
    const mostRecentOccupant = occupants.reduce((latest, current) => {
        return current.createdAt! > latest.createdAt! ? current : latest;
    });
    
    if (mostRecentOccupant.id != undefined) {
        await makeAccomodationAdmin(mostRecentOccupant.id, connectionToUse);
    }
}

