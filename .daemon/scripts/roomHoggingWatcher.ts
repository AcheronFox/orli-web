import _ from "lodash";
import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { getAllAccomodations } from "@/services/accomodation/service.accomodation.select";
import { IRoom } from "@/models/newDbModels/room.model";
import { getAllRooms } from "@/services/room/service.room.select";
import { leaveRoom } from "@/services/accomodation/service.accomodation.update";

export async function roomHoggingWatcher(): Promise<number> {
    const accomodations: IAccomodation[] | undefined = await getAllAccomodations();
    const rooms: IRoom[] | undefined = await getAllRooms();
    const currentDate = new Date();

    if (!(accomodations?.length && rooms?.length))
        return 0;


    let removedCount = 0;

    for (let i = 0; i < rooms.length; i++)
    {
        const roomAccomodations = accomodations.filter((o) => o.roomId == rooms[i].id);

        if (!roomAccomodations.length || roomAccomodations.length >= 2)
            continue;

        for (let j = 0; j < roomAccomodations.length; j++)
        {
            const accomodationDate = new Date(roomAccomodations[j].createdAt!)
        
            if (((accomodationDate.getTime() + (1000 * 60 * 60 * 24 * 3)) <= currentDate.getTime()))
            {
                const removalStatus = leaveRoom(roomAccomodations[j]);
                if (!removalStatus) {
                    console.log(`Failed to remove accomodation ${roomAccomodations[j].id}`);
                }
                else {
                    removedCount++
                }
            }
        }
    }

    return removedCount;
}

export default roomHoggingWatcher;