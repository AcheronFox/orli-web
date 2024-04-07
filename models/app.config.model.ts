export interface IAppConfig {
    profile: {
        uploadToDate: Date;
        serverDate?: Date;
    },
    registration: {
        start: Date;
        end: Date;
        serverDate?: Date;
    },
    ticket: {
        serverDate?: Date;
        isEarlyBird?: boolean;
        isOpen?: boolean;
        dates: {
            earlyBirdStart: Date;
            earlyBirdEnd: Date;
        },
        types: ITicketType[];
    }
}

export interface ITicketType {
    name: string;
    price: number | string;
    earlyBirdPrice?: number | string;
    limit?: number;
}
