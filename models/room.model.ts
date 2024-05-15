export interface IRoom {
    id: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    number: string;
    size: number;
    customName?: string;
    hasRoomPin?: boolean;
    occupantCount?: number;
}

export interface IRoomRaw {
    id: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    number: string;
    size: number;
    customName?: string;
    pin?: string;
    freeSpots?: number;
}

export interface IRoomStructure {[index: string]: IRoom[]; };