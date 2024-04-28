import database from "@/functions/utils/mysql";
import { PoolConnection } from "mysql";

export async function executeSelectQuery<T>(queryString: string, values: any, connectionToUse?: PoolConnection): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        const connection = connectionToUse || database;
        connection.query(queryString, values, async (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result) {
                if (result.length == 1) {
                    resolve(result[0] as T);
                }

                if (result.length > 1) {
                    resolve(result as T);
                }

                resolve(undefined);
            }
            reject();
        });
    });
}

export async function executeInsertQuery(queryString: string, values: any, connectionToUse?: PoolConnection): Promise<number> {
    return new Promise((resolve, reject) => {
        const connection = connectionToUse || database;
        connection.query(queryString, values, async (error, result, fields) => {
            if (error) {
                console.log(error);
                throw error;
            }
            resolve(result.insertId);
        });
    });
}

export async function executeUpdateQuery(queryString: string, values: any, connectionToUse?: PoolConnection): Promise<number> {
    return new Promise((resolve, reject) => {
        const connection = connectionToUse || database;
        connection.query(queryString, values, async (error, result, fields) => {
            if (error) {
                console.log(error);
                throw error;
            }
            resolve(result.affectedRows);
        });
    });
}

/**
 * Get today's date in an easy-to-read format that is also suitable for MySQL.<br />
 * <i>Example output: 2024-03-27</i>
 */
export function getTodayInIsoFormat(): string {
    return (new Date()).toISOString().split('T')[0];
}

export function getDateObjectInIsoFormat(date: any): string {
    return ((date as unknown as Date).toISOString().split('T')[0])
}

export function getRequestPropertyAsNumber(property: string | string[] | undefined): number | undefined {
    if (Array.isArray(property) || property === undefined) {
        return undefined;
    }

    const numberValue = Number(property);
    if (isNaN(numberValue)) {
        return undefined;
    }
    return numberValue;
}
