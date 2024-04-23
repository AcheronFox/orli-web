import { IAccomodation } from "@/models/newDbModels/accomodation.model";
import { IRoom } from "@/models/newDbModels/room.model";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { IDailyTicket } from "@/models/newDbModels/dailyticket.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
import { INationality } from "@/models/newDbModels/nationality.model";
import { ITicket } from "@/models/newDbModels/ticket.model";

export interface IAttendeeFullData {
    attendee: Omit<IAttendee, 'password'>,
    accomodation?: IAccomodation,
    fursona?: IFursona,
    nationality?: INationality,
    room?: IRoom,
    ticket?: ITicket,
    dailyTicket?: IDailyTicket
}