import path from "path";
import fs from "fs";

export async function resetMailLimit(mailLimit: any): Promise<number | undefined>
{
    if (mailLimit == undefined)
        return undefined;
    
    const defaultLimit = parseInt(mailLimit);

    const dataToWrite = {
        mailCount: defaultLimit
    }

    const filePath = path.join(`${process.cwd()}`, "utils/shared.json");
    const data = JSON.stringify(dataToWrite, null, 2);
    fs.writeFileSync(filePath, data);

    return defaultLimit;
}

export default resetMailLimit;