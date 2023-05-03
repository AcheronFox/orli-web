export interface ITicketForm {
    ticketType: '0' | '1' | '2';
    extra0: boolean;
    extra1: boolean;
    sponsorLevel: '0' | '1' | '2';
    shirt: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | null;
    sponsorPrice: number;
    foodData: {[index: number]: number; } | null;
    startDay: string;
    endDay: string;
}