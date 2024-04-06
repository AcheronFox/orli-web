export interface IAppConfig {
    profile: {
        uploadToDate: Date;
    },
    registration: {
        start: Date;
        end: Date;
    },
    ticket: {
        dates: {
            start: Date;
            end: Date;
            earlyBirdEnd: Date;
        },
        types: ITicketType[],
        extraPrices: {
            earlyArrival: number;
            earlyArrivalEarlyBird: number;
            lateDeparture: number;
            lateDepartureEarlyBird: number;
        }
    }
}

export interface ITicketType {
    name: string;
    price: number;
    earlyBirdPrice: number;
    limit: number;
}
