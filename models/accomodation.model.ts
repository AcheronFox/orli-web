export interface IAccomodation {
    id: number;
    roomId: number;
}

export interface IAccomodationRaw {
    id: number;
    AccountKey: string;
    AccomodationKey: string;
    creationDate: string;
    roomId: number;
    telegram?: string;
}