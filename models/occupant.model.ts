export interface IOccupant {
    fursonaName: string;
    fursonaSpecies: string;
    picture: string;
    isFursuiter: boolean;
    sponsorLevel: '0' | '1' | '2';
    registeredAt: string;
    telegram?: string;
    isRoomAdmin: boolean;
    roomId: number;
    AccountKey: string;
}

export interface IOccupantRaw {
    fursonaName: string;
    fursonaSpecies: string;
    picture: string;
    isFursuiter: boolean;
    sponsorLevel: '0' | '1' | '2';
    registeredAt: string;
    telegram?: string;
    adminKey: string;
    roomId: number;
    AccountKey: string;
}