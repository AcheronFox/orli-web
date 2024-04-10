export interface ITicket {
    intro: string[];
    content: {
        title: string;
        body: string[];
        priceKey?: string;
    }[];
    outro: string[];
}