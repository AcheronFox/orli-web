import { IAccount } from "@/models/account.model";
import { IUser } from "@/models/user.model";
import database from '../functions/utils/mysql';
import { TicketDatabase } from "@/models/database.model";
import dbPrisma from "@/database/DatabaseClient";

const getAccountByEmail = async (email: string) => {

    return dbPrisma.attendee.findFirst({
        where: {
            email: email.toLowerCase()
        }
    })

    // const query =
    //     `
    //     SELECT * FROM account
    //     WHERE email = ?;
    //     `
    //
    // return getPromiseFromDatabase<IAccount>(query, email.toLowerCase());
}

const getAccountByKey = async (key: string) => {
    const query =
        `
        SELECT * FROM account
        WHERE AccountKey = ?;
        `

    return getPromiseFromDatabase<IAccount>(query, key);
}

const getUserByAccountKey = async (key: string) => {
    const query =
        `
        SELECT * FROM user
        WHERE AccountKey = ?;
        `

    return getPromiseFromDatabase<IUser>(query, key);
}

const getTicketByAccountKey = async (key: string) => {
    const query =
        `
        SELECT * FROM ticket
        WHERE AccountKey = ?;
        `
    return getPromiseFromDatabase<TicketDatabase>(query, key);
}

async function getPromiseFromDatabase<T>(query: string, queryData: string): Promise<T | undefined> {
    try {
        return await new Promise<T | undefined>(async (resolve) => {

            database.query(query, [queryData], async (err: any, result: T[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    resolve(undefined);
                }
                if (result) {
                    resolve(result[0] as T);
                } else {
                    resolve(undefined);
                }
            });
        });
    } catch {
        return undefined;
    }
}


export {
    getAccountByEmail,
    getAccountByKey,
    getUserByAccountKey,
    getTicketByAccountKey,
}