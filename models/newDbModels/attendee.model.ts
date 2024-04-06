export interface IAttendee {
    id?: number; // ID can be null since when creating a model, the DB will take care of it anyway.
    accountKey: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    phone?: number;
    telegram?: string;
    allergy?: string;
    registeredAt?: string;
    verified: boolean;
    admin: boolean;
    staff: boolean;
    fursonaId: number;
    nationalityId?: number;
    accomodationId?: number;
    passwordResetTokenId?: number;
    ticketId?: number;
    dailyTicketId?: number;
}