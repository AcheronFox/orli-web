import dotenv from "dotenv"
import schedule from "node-schedule"
import resetLimit from "./scripts/resetMailLimit"
import ticketLimitWatcher from "./scripts/ticketLimitWatcher"
import roomHoggingWatcher from "./scripts/roomHoggingWatcher"

const isProd = process.argv[2] == "production";
const log = (message: string) => {
    console.log(`\x1b[96mdaemon\x1b[0m - ${message}`);
}

const start = () => {
    log("Online");
    dotenv.config();
    if (!isProd) log("Loaded env");
}
start()

schedule.scheduleJob('0 0 * * * *', async () => { // 0 0 * * * *
    try {
        // Email count watcher
        await resetLimit();

        // Ticket payment watcher
        await ticketLimitWatcher();

        // Room hogging watcher
        await roomHoggingWatcher();
    }
    catch(e) {
        log(`Error: ${e}`);
    }
}); // Trigger every hour

/*
                *    *    *    *    *    *
                ┬    ┬    ┬    ┬    ┬    ┬
                │    │    │    │    │    |
                │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
                │    │    │    │    └───── month (1 - 12)
                │    │    │    └────────── day of month (1 - 31)
                │    │    └─────────────── hour (0 - 23)
                │    └──────────────────── minute (0 - 59)
                └───────────────────────── second (0 - 59, OPTIONAL)
*/

export {log, isProd}