export interface IRoom {
    id?: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    number: string;
    size: number;
    customName?: string;
    pin?: number;
}