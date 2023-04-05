import { IAccount } from "@/models/account.model";
import { IUser } from "@/models/user.model";
import database from './mysql';
import { TicketDatabase } from "@/models/database.model";

const getAccountByEmail = async (email: string) => {
    return new Promise<IAccount | undefined>(async (resolve) => {
        const query = 
        `
        SELECT * FROM account
        WHERE email = '${email.toLowerCase()}'
        `

        database.query(query, async (err: any, result: IAccount[]) => {
            if (err) {
                console.log("ERROR: ", err);
                resolve(undefined);
            }
            if (result) {
                resolve(result[0]);
            }
            else {
                resolve(undefined);
            }
        });
    }).catch(() => {
        return undefined
    });
}

const getAccountByKey = (key: string) => {
    return new Promise<IAccount | undefined>(async (resolve) => {
        const query = 
        `
        SELECT * FROM account
        WHERE AccountKey = '${key}'
        `

        database.query(query, async (err: any, result: IAccount[]) => {
            if (err) {
                console.log("ERROR: ", err);
                resolve(undefined);
            }
            if (result) {
                resolve(result[0]);
            }
            else {
                resolve(undefined)
            }
        });
    }).catch(() => {
        return undefined
    });
}

const getUserByAccountKey = async (key: string) => {
    return new Promise<IUser | undefined>(async (resolve) => {
        const query = 
        `
        SELECT * FROM user
        WHERE AccountKey = '${key}'
        `

        database.query(query, async (err: any, result: IUser[]) => {
            if (err) {
                console.log("ERROR: ", err);
                resolve(undefined);
            }
            if (result) {
                resolve(result[0]);
            }
            else {
                resolve(undefined)
            }
        });
    }).catch(() => {
        return undefined
    });
}

const getTicketByAccountKey = async (key: string) => {
    return new Promise<TicketDatabase | undefined>(async (resolve) => {
        const query = 
        `
        SELECT * FROM ticket
        WHERE AccountKey = '${key}'
        `

        database.query(query, async (err: any, result: TicketDatabase[]) => {
            if (err) {
                console.log("ERROR: ", err);
                resolve(undefined);
            }
            if (result) {
                resolve(result[0]);
            }
            else {
                resolve(undefined)
            }
        });
    }).catch(() => {
        return undefined
    });
}

export {
    getAccountByEmail,
    getAccountByKey,
    getUserByAccountKey,
    getTicketByAccountKey,
}