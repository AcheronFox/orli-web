export interface IPasswordResetToken {
    id: number;
    token: string;
    tokenExpireTime: number; // I assume it's an EPOCH right?
}