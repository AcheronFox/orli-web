export class UserDatabase {
    UserKey: string | undefined = undefined
    AccountKey: string | undefined = undefined
    fursonaName: string | undefined = undefined
    fursonaSpecies: string | undefined = undefined
    picture: string | undefined = undefined
    registeredAt: string | undefined = undefined
    SponsorLevel: '0' | '1' | '2' | undefined = undefined
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
    isVerified: boolean | undefined = undefined;
    isAdmin: boolean | undefined = undefined;
    AccomodationKey: string | undefined = undefined;
    TicketKey: string | undefined = undefined;
}

export class SafeUserDatabase {
    fursonaName: string | undefined = undefined
    fursonaSpecies: string | undefined = undefined
    picture: string | undefined = undefined
    registeredAt: string | undefined = undefined
    SponsorLevel: '0' | '1' | '2' | undefined = undefined
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