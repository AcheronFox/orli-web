import {IAppConfig} from "@/models/app.config.model";

const configuration: IAppConfig = {
    profile: {
        uploadToDate: new Date(2024, 5, 2)
    },
    registration: {
        start: new Date(2024, 0, 1),
        end: new Date(2024, 5, 18)
    },
    ticket: {
        dates: {
            earlyBirdEnd: new Date(2024, 4, 15),
            start: new Date(2024, 0, 1),
            end: new Date(2024, 5, 18)
        },
        extraPrices: {
            earlyArrival: 1111,
            earlyArrivalEarlyBird: 1000,
            lateDeparture: 2222,
            lateDepartureEarlyBird: 2000
        },
        types: [
            {
                name: "WACC",
                price: 55000,
                earlyBirdPrice: 50000,
                limit: 55
            },
            {
                name: "TENT",
                price: 44000,
                earlyBirdPrice: 40000,
                limit: 44
            },
            {
                name: "NACC",
                price: 33000,
                earlyBirdPrice: 30000,
                limit: 33
            },
            {
                name: "DAILY",
                price: 22000,
                earlyBirdPrice: 20000,
                limit: 22
            }
        ]
    }
}

export {configuration};
