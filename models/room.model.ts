export interface IRoom {
    id: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    roomNumber: string;
    size: number;
    customName?: string;
    hasRoomPin?: boolean;
    occupantCount?: number;
}

export interface IRoomRaw {
    id: number;
    building: 'Fácán' | 'Vidra' | 'Kócsag';
    roomNumber: string;
    size: number;
    customName?: string;
    roomPin?: string;
    adminKey?: string;
    freeSpots?: number;
}

export interface IRoomStructure {[index: string]: IRoom[]; };