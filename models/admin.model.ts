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
    fursonaName: string | undefined;
    isPaid: number | undefined;
    isVerified: number | undefined;
    paymentMethod: string;
    boolean: Array<{[index: string]: string;}>
}

export const defaultSearchQuery: ISearchQuery = {
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    dateOfBirth: '',
    fursonaName: undefined,
    isPaid: undefined,
    isVerified: undefined,
    paymentMethod: '',
    boolean: []
}