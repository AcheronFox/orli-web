export interface ITicketForm {
    ticketType: '0' | '1' | '2';
    extra0: boolean;
    extra1: boolean;
    sponsorLevel: '0' | '1' | '2';
    sponsorPrice: number;
    foodData: {[index: number]: number; } | null;
    startDay: string;
    endDay: string;
}