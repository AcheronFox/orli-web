export interface IRegistrationForm {
    firstName: string;
    lastName: string;
    fursonaName: string;
    fursonaSpecies: string;
    email: string;
    dateOfBirth: Date;
    age: number;
    nationality: string;
    password: string;
    telegram: string;
    phone: string;
    allergy: string;
    otherPass: string;
    storage: boolean;
}

export interface IRegistrationDataSave  {
    FirstName: string;
    LastName: string;
    FursonaName: string;
    FursonaSpecies: string;
    Email: string;
    DoB: string;
    Nationality: string;
    Telegram: string;
    Phone: string;
    Allergy: string;
    OtherPass: string;
    Storage: boolean;
}