export interface IOccupant {
    name: string;
    species: string;
    pathToPictureFile: string;
    hasFursuit: boolean;
    sponsorLevel: 'None' | 'Regular' | 'Super';
    registeredAt: string;
    ownerContact?: string;
    isOwner: boolean;
    roomId: number;
    id: number;
}

export interface IOccupantRaw {
    name: string;
    species: string;
    pathToPictureFile: string;
    hasFursuit: boolean;
    sponsorLevel: 'None' | 'Regular' | 'Super';
    registeredAt: string;
    ownerContact?: string;
    isOwner: false;
    roomId: number;
    id: number;
}