export interface IRoom {
    id: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    roomNumber: string;
    size: number;
    customName?: string;
    roomPin?: string;
    adminKey?: string;
}

export interface IRoomStructure {[index: string]: IRoom[]; };