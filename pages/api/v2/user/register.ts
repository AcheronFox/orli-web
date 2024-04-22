import type {NextApiRequest, NextApiResponse} from "next";
import {IRegistrationForm} from "@/models/registration-form.model";
import {getAttendeeByEmail} from "@/services/attendee/service.attendee.select";
import {createAttendeeFromForm} from "@/services/attendee/service.attendee.insert";
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import {getNationality} from "@/services/nationality/service.nationality";
import {configuration} from "@/private/app.config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(!await isMethodAllowed(req, res, 'POST')) {
        return;
    }

    // Bot detection
    if (req.body.otherPass != "") {
        res.status(400).json({message: "Spam detection triggered", e_code: "reg_20"});
        return;
    }

    const serverDate = new Date();
    const isOpen = serverDate >= configuration.registration.start && serverDate < configuration.registration.end;
    if(!isOpen) {
        res.status(400).json({message: "Registration is not open", e_code: "reg_26"});
        return;
    }

    let form = validateFormContent(req.body);
    if (!form) {
        res.status(400).json({message: "Malformed request:", e_code: "reg_19", data: req.body});
        return;
    }

    if(!isValidPassword(form.password)) {
        res.status(400).json({ message: "Password doesn't comply regulations", e_code: "reg_16", });
        return;
    }

    if(form.fursonaName.length > 10) {
        res.status(400).json({ message: "Fursona name can't be longer than 10 due to badge printing", e_code: "reg_24", });
        return;
    }

    if(form.fursonaSpecies.length > 10) {
        res.status(400).json({ message: "Fursona species can't be longer than 10 due to badge printing", e_code: "reg_25", });
        return;
    }

    try {
        if (await emailAlreadyRegistered(form.email)) {
            res.status(409).json({message: "Email already registered", e_code: "reg_2"});
            return;
        }

        if (!await nationalityValid(form.nationalityId)) {
            res.status(400).json({message: "Nationality not valid", e_code: "reg_23"});
            return;
        }

        let attendee = await createAttendeeFromForm(form);
        if(!attendee) {
            res.status(500).json({message: "Unknown Error", e_code: "reg_14"});
            return;
        }

        res.status(200).json({message: "Registered"});

    } catch (e) {
        // Unhandled error, most likely from database
        console.log(e);
        res.status(500).json({message: "Unknown Error", e_code: "reg_14"});
        return;
    }

}

function validateFormContent(form: any): IRegistrationForm | undefined {
    // Validate type
    const isRegistrationForm = (x: any): x is IRegistrationForm => {
        return typeof x.firstName === 'string' &&
            typeof x.lastName === 'string' &&
            typeof x.fursonaName === 'string' &&
            typeof x.fursonaSpecies === 'string' &&
            typeof x.email === 'string' &&
            typeof x.dateOfBirth === 'string' &&
            typeof x.password === 'string' &&
            typeof x.nationalityId === 'number' &&
            typeof x.allergy === 'string' &&
            typeof x.telegram === 'string' &&
            typeof x.phone === 'string' &&
            typeof x.storage === 'boolean'
    };

    // Validate required fields
    const isValidForm = (x: IRegistrationForm) => {
        return x.firstName != '' &&
            x.lastName != '' &&
            x.fursonaName != '' &&
            x.fursonaSpecies != '' &&
            x.email != '' &&
            x.dateOfBirth != null &&
            x.password != '' &&
            x.nationalityId != 0 &&
            (x.phone != '' || x.telegram != '')
    };

    if (isRegistrationForm(form) && isValidForm(form)) {
        return form as IRegistrationForm;
    } else {
        return undefined;
    }
}

async function emailAlreadyRegistered(email: string): Promise<boolean> {
    let attendee = await getAttendeeByEmail(email);

    return !!attendee;
}

async function nationalityValid(nationalityId: number): Promise<boolean> {
    let nationality = await getNationality(nationalityId);

    return !!nationality;
}

function isValidPassword(password: string): boolean {
    const hasLowerCase = (str: string) => {
        return str.toUpperCase() != str;
    };
    const hasUpperCase = (str: string) => {
        return str.toLowerCase() != str;
    };
    const hasNumber = (str: string) => {
        return /\d/.test(str);
    };
    const isLongerThanSix = (str: string) => {
        return str.length >= 6;
    };

    return (!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password))
}