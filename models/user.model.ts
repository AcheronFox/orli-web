export interface IUser {
    accountKey: string;
    firstName: string;
    lastName: string;
    email: string;
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

    name: string;
    species: string;
    pathToPictureFile: string;
    hasFursuit: boolean;

    sponsorLevel?: number
    isPaid?: boolean
}

export class UserData {
    accountKey: string | undefined = undefined
    firstName: string | undefined = undefined
    lastName: string | undefined = undefined
    email: string | undefined = undefined
    dateOfBirth: string | undefined = undefined
    phone?: number | undefined = undefined
    telegram?: string | undefined = undefined
    allergy?: string | undefined = undefined
    registeredAt?: string | undefined = undefined
    verified: boolean | undefined = undefined
    admin: boolean | undefined = undefined
    staff: boolean | undefined = undefined
    fursonaId: number | undefined = undefined
    nationalityId?: number | undefined = undefined
    accomodationId?: number | undefined = undefined
    passwordResetTokenId?: number | undefined = undefined

    name: string | undefined = undefined
    species: string | undefined = undefined
    pathToPictureFile: string | undefined = undefined
    hasFursuit: boolean | undefined = undefined;

    sponsorLevel: number | undefined = undefined
    isPaid: boolean | undefined = undefined
}