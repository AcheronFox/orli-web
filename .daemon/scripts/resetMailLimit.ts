import path from "path";
import fs from "fs";
import { isProd, log } from ".daemon/daemon";

const resetLimit = async () => {
    if (!process.env.MAIL_LIMIT) {
        log("Error: No MAIL_LIMIT set");
        return;
    }
    const defaultLimit = parseInt(process.env.MAIL_LIMIT);

    const dataToWrite = {
        mailCount: defaultLimit
    }

    try {
        const filePath = path.join(`${process.cwd()}`, "utils/shared.json");
        const data = JSON.stringify(dataToWrite, null, 2);
        fs.writeFileSync(filePath, data);
        
        if (!isProd)
            log(`Mail Limit reset to ${defaultLimit}`);
    }
    catch(e) {
        log(`Error: ${e}`);
        return;
    }
}

export default resetLimit;