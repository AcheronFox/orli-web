import dotenv from "dotenv"
import schedule from "node-schedule"
import resetLimit from "./scripts/resetMailLimit"


const log = (message: string) => {
    console.log(`\x1b[96mdaemon\x1b[0m - ${message}`)
}

const start = () => {
    log("Online")
    dotenv.config()
    log("Loaded env")
}
start()


// Ticket payment watcher
schedule.scheduleJob('0 0 * * * *', async () => {
    try {
        
    }
    catch(e) {
        log(`Error: ${e}`)
    }
}); // Trigger every ?

// Email count watcher
schedule.scheduleJob('0 0 * * * *', async () => {
    try {
        await resetLimit()
    }
    catch(e) {
        log(`Error: ${e}`)
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

export {log}