import database from "@/functions/utils/mysql";
import {executeInsertQuery} from "@/functions/utils/databaseHelpers";
import {IAttendee} from "@/models/newDbModels/attendee.model";
import {IRegistrationForm} from "@/models/registration-form.model";
import {v4 as uuidv4} from "uuid";
import {getAttendeeById} from "@/services/attendee/service.attendee.select";
import * as bcrypt from "bcrypt";

const TABLE: string = "attendee";
const FURSONA_TABLE: string = "fursona";

export async function insertAttendee(attendee: IAttendee): Promise<number> {
    const insertString = `INSERT INTO ${TABLE} SET ?;`;

    return await executeInsertQuery(insertString, attendee);
}

export async function createAttendeeFromForm(form: IRegistrationForm): Promise<IAttendee | undefined> {
    // form is validated by caller so we just insert it
    const accountKey = uuidv4();
    const passwordHash: string = await bcrypt.hash(form.password, 12);
    if (!passwordHash) {
        throw new Error("Password hashing failed");
    }

    let attendeeId = await new Promise<number>((mainResolve, mainReject) => {
        database.getConnection((err, connection) => {
            if (err) {
                throw err;
            }

            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    throw err;
                }

                try {
                    const fursona = {
                        name: form.fursonaName,
                        species: form.fursonaSpecies,
                        pathToPictureFile: "",
                    };
                    const fursonaQuery = `INSERT INTO ${FURSONA_TABLE} SET ?;`;

                    let fursonaId = await new Promise<number>((resolve, reject) => {
                        connection.query(fursonaQuery, fursona, async (err, result) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                resolve(result.insertId);
                            }
                        });
                    }).catch((e) => {
                        throw (e)
                    });

                    const attendee = {
                        accountKey: accountKey,
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        password: passwordHash,
                        nationalityId: form.nationalityId,
                        dateOfBirth: toSqlDatetime(form.dateOfBirth),
                        phone: form.phone,
                        telegram: form.telegram,
                        allergy: form.allergy,
                        fursonaId: fursonaId,
                        verified: false,
                        admin: false,
                        staff: false,
                        storage: false,
                    };
                    const attendeeQuery = `INSERT INTO ${TABLE} SET ?;`;

                    let attendeeId = await new Promise<number>((resolve, reject) => {
                        connection.query(attendeeQuery, attendee, async (err, result) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                resolve(result.insertId);
                            }
                        });
                    }).catch((e) => {
                        throw (e)
                    });

                    connection.commit((err) => {
                        if (err) {
                            console.log(err);
                            throw (err);
                        }

                        connection.release();
                        mainResolve(attendeeId);
                    });

                } catch (error) {
                    connection.rollback(() => {
                        connection.release();
                        mainReject(error);
                    });
                }
            });


        });
    });

    return await getAttendeeById(attendeeId);
}

const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffset
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}
