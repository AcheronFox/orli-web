export class UserDatabase {
    UserKey: string | undefined = undefined
    AccountKey: string | undefined = undefined
    fursonaName: string | undefined = undefined
    fursonaSpecies: string | undefined = undefined
    picture: string | undefined = undefined
    isFursuiter: boolean | undefined = undefined
}

export class AccountDatabase {
    firstName: string | undefined = undefined;
    lastName: string | undefined = undefined;
    email: string | undefined = undefined;
    password: string | undefined = undefined;
    nationality: string | undefined = undefined;
    dateOfBirth: string | undefined = undefined;
    age: number | undefined = undefined;
    contact: string | undefined = undefined;
    registeredAt: string | undefined = undefined
    isVerified: boolean | undefined = undefined;
    isAdmin: boolean | undefined = undefined;
    AccomodationKey: string | undefined = undefined;
    TicketKey: string | undefined = undefined;
}

export class TicketDatabase {
    AccountKey: string | undefined = undefined;
    TicketKey: string | undefined = undefined;
    ticketType: '0' | '1' | '2' | undefined = undefined;
    extra0: boolean | undefined = undefined;
    extra1: boolean | undefined = undefined;
    sponsorLevel: '0' | '1' | '2' | undefined = undefined;
    shirt: 'S' | 'M' | 'L' | 'XL' | 'XXL' | undefined = undefined;
    sponsorPrice: number | undefined = undefined;
    totalPrice: number | undefined = undefined;
    foodData: {[index: number]: number} | undefined | string = undefined;
    startDay: string | undefined = undefined;
    endDay: string | undefined = undefined;
    creationDate: string | undefined = undefined;
    isPaid: boolean | undefined = undefined;
}

export class AccomodationDatabase {
    AccountKey: string | undefined = undefined;
    AccomodationKey: string | undefined = undefined;
    creationDate: string | undefined = undefined;
    roomId: number | undefined = undefined;
    telegram: string | undefined = undefined;
}

export class RoomDatabase {
    building: 'Fácán' | 'Vidra' | 'Kócsag' | undefined = undefined;
    roomNumber: string | undefined = undefined;
    size: number | undefined = undefined;
    roomPin: string | undefined = undefined;
    customName: string | undefined = undefined;
    adminKey: string | undefined = undefined;
}

export class SafeUserDatabase {
    fursonaName: string | undefined = undefined
    fursonaSpecies: string | undefined = undefined
    picture: string | undefined = undefined
    registeredAt: string | undefined = undefined
    isFursuiter: boolean | undefined = undefined
}

export class SafeAccountDatabase {
    firstName: string | undefined = undefined;
    lastName: string | undefined = undefined;
    email: string | undefined = undefined;
    password: string | undefined = undefined;
    nationality: string | undefined = undefined;
    dateOfBirth: string | undefined = undefined;
    age: number | undefined = undefined;
    contact: string | undefined = undefined;
    isVerified: boolean | undefined = undefined;
}