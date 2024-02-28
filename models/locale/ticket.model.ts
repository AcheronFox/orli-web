export interface ITicket {
    intro: string[];
    content: {
        title: string;
        body: string[];
    }[];
    outro: string[];
}