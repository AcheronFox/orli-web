import 'dotenv/config'; // Let it be known, I've suffered for this.
import schedule from "node-schedule"
import roomHoggingWatcher from './scripts/roomHoggingWatcher';
import resetLimit from './scripts/resetMailLimit';

const isProd = process.argv[2] == "production";
const log = (message: string) => {
    console.log(`\x1b[96mdaemon\x1b[0m - ${message}`);
}

const start = () => {
    log("Online");
    if (!isProd) log("Loaded env");
    setUpJobs();
}
start();

function setUpJobs() {
    schedule.scheduleJob('*/10 * * * * *', async () => { // 0 0 * * * *
        try {

            await resetLimit();

            const removedRoomCount = await roomHoggingWatcher();

            if (!isProd) {
                log(`${removedRoomCount? removedRoomCount : 'No'} accomodations have been removed.`);
            }


        }
        catch(e) {
            log(`Error: ${e}`);
        }
    });
}


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