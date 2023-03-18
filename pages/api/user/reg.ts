// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IRegistrationForm } from '@/models/registration-form.model';
import database from '@/utils/mysql'
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as mysql from "mysql";
import isMethodAllowed from '@/utils/isMethodAllowed';

const toSqlDatetime = (inputDate: Date) => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}

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

const isPassValid = (password: string) => {
    return (!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password))
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    const isRegistrationForm = (x: any): x is IRegistrationForm => {
        if (typeof x.firstName === 'string' &&
            typeof x.lastName === 'string' &&
            typeof x.fursonaName === 'string' &&
            typeof x.fursonaSpecies === 'string' &&
            typeof x.email === 'string' &&
            typeof x.dateOfBirth === 'string' &&
            typeof x.age === 'number' &&
            typeof x.password === 'string' &&
            typeof x.nationality === 'string' &&
            typeof x.contact === 'string') {
                return true
            }
        else return false
    }

    const isValidForm = (x: IRegistrationForm) => {
        if (x.firstName != '' &&
            x.lastName != '' &&
            x.fursonaName != '' &&
            x.fursonaSpecies != '' &&
            x.email != '' &&
            x.dateOfBirth != null &&
            x.age != 0 &&
            x.password != '' &&
            x.nationality != '' &&
            x.contact != '') {
                return true
            }
        else return false
    }

    if (isRegistrationForm(req.body) && isValidForm(req.body)) {
        let newAccountKey = uuidv4();
        let newUserKey = uuidv4();
        let i1 = 0;
        let i2 = 0;

        // ====================================================
        // INITIAL CHECKS
        // ====================================================
        const hasAccountConflict = async () => {
            return new Promise(async (resolve) => {
                database.query(`SELECT * FROM account WHERE email = '${req.body.email.toLowerCase().trim()}' OR AccountKey = '${newAccountKey}'`, async (err: any, result: string | any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "reg_1"});
                        resolve(true);
                    }
                    if (result.length) {
                        if (result[0].email == req.body.email.toLowerCase().trim()) {
                            sendResponse(409, {message: "Email already registrated", e_code: "reg_2"});
                            resolve(true);
                        }
                        else {
                            i1++;
                            if (i1 > 4) {
                                sendResponse(500, {message: "Initial Account check failed", e_code: "reg_3"});
                                resolve(true);
                            }
                            newAccountKey = uuidv4();
                            await hasAccountConflict();
                        }
                    } else {
                        resolve(false);
                    }
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "reg_4"}); 
            });
        }
        const hasUserConflict = async () => {
            return new Promise(async (resolve) => {
                database.query(`SELECT * FROM user WHERE UserKey = '${newUserKey}'`, async (err: any, result: string | any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "reg_5"});
                        resolve(true);
                    }
                    if (result.length) {
                        i2++;
                        if (i2 > 4) {
                            sendResponse(500, {message: "Initial User check failed", e_code: "reg_6"});
                            resolve(true);
                        }
                        newUserKey = uuidv4();
                        await hasUserConflict();
                    }
                    else {
                        resolve(false);
                    }
                })
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "reg_7"}); 
            });
        }

        // ====================================================
        // MAIN COMMIT
        // ====================================================
        const runCreate = async () => {
            return await new Promise<boolean>(async (mainResolve) => {
                database.getConnection((err, connection) => {
                    if (err) {
                        sendResponse(500, { message: "Unknown Error", e_code: "reg_8" });
                        mainResolve(false);
                    }
                    connection.beginTransaction(async (err) => {
                        if (err) {
                            console.log("ERROR: ", err);
                            connection.release();
                            sendResponse(500, { message: "Error while creating the transaction.", e_code: "reg_9" });
                            mainResolve(false);
                        }
                        const rollback = (con: mysql.PoolConnection) => {
                            con.rollback(() => {
                                con.release();
                            });
                        }
            
                        const createAccount = async (data: any) => {
                            return new Promise<boolean>(async (resolve) => {
                                Object.keys(data).forEach(k => {
                                    try {
                                        (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                    } catch {
                                        rollback(connection);
                                        sendResponse(500, {message: "Unknown Error", e_code: "reg_10"});
                                        resolve(false);
                                    }
                                })

                                connection.query(mysql.format(`INSERT INTO account (${Object.keys(data).join(",")}) VALUES (?)`, [Object.values(data)]), (err: any, accountRes: { insertId: any; }) => {
                                    if (err) {
                                        console.log("ERROR: ", err);
                                        rollback(connection);
                                        sendResponse(500, {message: "Unknown Error", e_code: "reg_11"});
                                        resolve(false);
                                        return;
                                    }
                                    else {
                                        resolve(true)
                                    }
                                });
                            }).catch(() => {
                                rollback(connection);
                                sendResponse(500, {message: "Unknown Error", e_code: "reg_12"});
                                return false;
                            });
                        }
            
                        const createUser = async (data: any) => {
                            return new Promise<boolean>(async (resolve) => {
                                if (data.hasOwnProperty("dateOfBirth")) {
                                    data.dateOfBirth = toSqlDatetime(new Date(data.dateOfBirth.trim()));
                                }
                                Object.keys(data).forEach(k => {
                                    try {
                                        (typeof data[k] == 'string')? (data[k] = data[k].trim()) : {};
                                    } catch {
                                        rollback(connection);
                                        sendResponse(500, {message: "Unknown Error", e_code: "reg_13"});
                                        resolve(false);
                                    }
                                })

                                connection.query(mysql.format(`INSERT INTO user (${Object.keys(data).join(",")}) VALUES (?)`, [Object.values(data)]), (err: any) => {
                                    if (err) {
                                        console.log("ERROR: ", err);
                                        rollback(connection);
                                        sendResponse(500, {message: "Unknown Error", e_code: "reg_14"});
                                        resolve(false);
                                        return;
                                    }
                                    else {
                                        resolve(true);
                                    }
                                });
                            }).catch(() => {
                                rollback(connection);
                                sendResponse(500, { message: "Unknown Error", e_code: "reg_15" });
                                return false;
                            });
                        }

                        if (!isPassValid) {
                            rollback(connection);
                            sendResponse(500, { message: "Password doesn't comply regulations", e_code: "reg_16", });
                            return;
                        }

                        const encryptedPass = await bcrypt.hash(req.body.password, 12);
                        if (!encryptedPass) {
                            rollback(connection);
                            sendResponse(500, { message: "Couldn't hash password", e_code: "reg_17", });
                            return;
                        }

                        const accountPayload: any = {
                            AccountKey: newAccountKey,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email.toLowerCase(),
                            password: encryptedPass,
                            nationality: req.body.nationality,
                            dateOfBirth: toSqlDatetime(req.body.dateOfBirth.trim()),
                            age: req.body.age,
                            contact: req.body.contact,
                            allergy: req.body.allergy,
                            registeredAt: toSqlDatetime(new Date()),
                        }
                        const userPayload: any = {
                            UserKey: newUserKey,
                            AccountKey: newAccountKey,
                            fursonaName: req.body.fursonaName,
                            fursonaSpecies: req.body.fursonaSpecies,
                        }

                        const accountInsertionState: boolean = await createAccount(accountPayload);
                        let userInsertionState: boolean = false
                        if (accountInsertionState) userInsertionState = await createUser(userPayload);
            
                        if (accountInsertionState && userInsertionState) {
                            connection.commit(function (err) {
                                if (err) {
                                    console.log(err)
                                    connection.rollback(function () {
                                        sendResponse(500, { message: "Error While Committing", e_code: "reg_18" });
                                        mainResolve(false);
                                    });
                                } else {
                                    connection.release();
                                    mainResolve(true);
                                }
                            });
                        }
                    });
                });
            });
        }

        const accountConflicts = await hasAccountConflict();
        const userConflicts = await hasUserConflict();
        if (!accountConflicts && !userConflicts) {
            const result = await runCreate();
            if (result) {
                sendResponse(201, {message: "Registrated"});
            }
        }
    }
    else sendResponse(400, {message: "Malformed request:", e_code: "reg_19", data: req.body});
}