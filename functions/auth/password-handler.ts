
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import database from "../utils/mysql";

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



const resetPassword = async (password: string, oldKey: string) => {
    let response;

    if (!isPassValid) {
        response = {error: "Password doesn't comply regulations"}
        return response;
    }

    const encryptedPass = await bcrypt.hash(password, 12);
    if (!encryptedPass) {
        response = {error: "Couldn't hash password"}
        return response;
    }

    let newAccountKey = uuidv4();

    const hasAccountConflict = async () => {
        return new Promise<boolean>(async (resolve) => {
            database.query(`SELECT * FROM account WHERE AccountKey = '${newAccountKey}'`, async (err: any, result: string | any[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    response = {error: "Unknown Error"}
                    resolve(true);
                }
                if (result.length) {
                    newAccountKey = uuidv4();
                    await hasAccountConflict();
                } else {
                    resolve(false);
                }
            });
        });
    }

    const hasConflict = await hasAccountConflict()

    if (hasConflict) {
        return response;
    } else {
        const updateKeys = async () => {
            return new Promise<boolean>(async (resolve) => {
                const query = `
                UPDATE account SET
                account.AccountKey = '${newAccountKey}',
                account.password = '${encryptedPass}'
                WHERE
                account.AccountKey = '${oldKey}'
                `
                database.query(query, async (err: any, result: string | any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        response = {error: "Unknown Error"}
                        resolve(false);
                    }
                    else {
                        resolve(true)
                    }
                });
            });
        }

        const isSuccessful = await updateKeys()

        if (!isSuccessful) {
            return response;
        } else {
            response = {success: newAccountKey}
            return response
        }
    } 
}

export default resetPassword