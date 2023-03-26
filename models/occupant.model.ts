export interface IOccupant {
    fursonaName: string;
    picture?: string;
    telegram?: string;
    isRoomAdmin: boolean;
    roomId: number;
}

export interface IOccupantRaw {
    fursonaName: string;
    picture: string;
    telegram?: string;
    adminKey: string;
    roomId: number;
}