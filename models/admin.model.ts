export interface IAdminChart {
    verified: any;
    payment: any;
    ticket: any;
}

export interface ISearchQuery {
    firstName: string;
    lastName: string;
    email: string;
    nationality: string;
    dateOfBirth: string;
    age: number | undefined;
    isPaid: number | undefined;
    isVerified: number | undefined;
    paymentMethod: string;
}

export const defaultSearchQuery: ISearchQuery = {
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    dateOfBirth: '',
    age: undefined,
    isPaid: undefined,
    isVerified: undefined,
    paymentMethod: '',
}