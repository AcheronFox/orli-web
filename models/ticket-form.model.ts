export interface ITicketForm {
    ticketType: 'WACC' | 'TENT';
    late: boolean;
    early: boolean;
    sponsorLevel: '0' | '1' | '2';
    shirt: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | null;
    sponsorPrice: number;
}