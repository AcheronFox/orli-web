import database from "@/functions/utils/mysql";

export async function executeDatabaseQuery<T>(queryString: string, values: any) : Promise<T | undefined>
{
    return new Promise((resolve, reject) => {
        database.query(queryString, values, async (error, result) =>
        {
            if (error)
            {
                console.log(error);
                reject();
            }
            if (result)
            {
                if (Array.isArray(result))
                {
                    if (result.length > 0)
                    {
                        resolve(result as T);
                    }
                    reject();
                }
                else
                {
                    // TODO: Don't log this on Prod!
                    console.log("Invalid type returned. Returned value: " + result);
                    reject();
                }
            }
            reject();
        });
    });
}

export async function executeInsertQuery(queryString: string, values: any) : Promise<boolean>
{
    return new Promise((resolve, reject) => {
        database.query(queryString, values, async (error, result, fields) =>
        {
            if (error)
            {
                console.log(error);
                reject(false);
            }
            resolve(true);
        });
    });
}