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
    contact: string;
    allergy: string;
    otherPass: string;
}

export interface IRegistrationDataSave  {
    FirstName: string;
    LastName: string;
    FursonaName: string;
    FursonaSpecies: string;
    Email: string;
    DoB: string;
    Nationality: string;
    Contact: string;
    Allergy: string;
    OtherPass: string;
}