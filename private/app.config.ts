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
            earlyBirdEnd: new Date(2024, 3, 29),
            earlyBirdStart: new Date(2024, 0, 1),
        },
        types: [
            {
                name: "WACC",
                price: "68 000",
                earlyBirdPrice: "58 000",
                limit: 88
            },
            {
                name: "TENT",
                price: "48 000",
                earlyBirdPrice: "40 000",
                limit: 80
            },
            {
                name: "NACC",
                price: "33 000",
                earlyBirdPrice: "30 000",
            },
            {
                name: "EARLY",
                price: "7 000",
                earlyBirdPrice: "6 000",
                limit: 22
            },
            {
                name: "LATE",
                price: "8 000",
                earlyBirdPrice: "7 000",
                limit: 22
            },
            {
                name: "DAILY",
                price: "22 000",
            },
            {
                name: "SPONS",
                price: "5 000 - 12 000",
            },
            {
                name: "SSPONS",
                price: "12 001",
            }
        ]
    }
}

export {configuration};
