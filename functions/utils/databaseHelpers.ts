import database from "@/functions/utils/mysql";

export async function executeSelectQuery<T>(queryString: string, values: any) : Promise<T | undefined>
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

export async function executeInsertQuery(queryString: string, values: any) : Promise<number | undefined>
{
    return new Promise((resolve, reject) => {
        database.query(queryString, values, async (error, result, fields) =>
        {
            if (error)
            {
                console.log(error);
                reject(undefined);
            }
            resolve(result.insertId);
        });
    });
}

export async function executeUpdateQuery(queryString: string, values: any) : Promise<number | undefined>
{
    return new Promise((resolve, reject) => {
       database.query(queryString, values, async (error, result, fields) =>
       {
           if (error)
           {
               console.log(error);
               reject(undefined);
           }
           resolve(result.affectedRows);
       });
    });
}