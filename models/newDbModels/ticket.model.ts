export interface ITicket {
    id: number;
    type: string;
    earlyArrival: boolean;
    lateDeparture: boolean;
    sponsorLevel: 'None' | 'Regular' | 'Super';
    shirtSize: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    sponsorPrice: number;
    totalPrice: number;
    paymentMethod: 'Bank' | 'PayPal' | 'Revolut' | '';
    isPaid: boolean;
    foodData: string;
    arrivalDate: string;
    departureDate: string;
    createdAt: string;
}