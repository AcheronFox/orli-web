import { isProd, log } from ".daemon/daemon";
import { TicketDatabase } from "@/models/database.model";
import database from "./daemonMysql";
import { sendMail } from "@/functions/mail/mail-controller";
import { findTemplate } from "@/functions/mail/mail-controller";
import { getAccountByKey, getUserByAccountKey } from "@/utils/getData";
import handlebars from "handlebars";

const ticketLimitWatcher = async () => {
    const ticketQuery = async () => {
        return new Promise<TicketDatabase[] | undefined>(async (resolve) => {
            const query = 
            `
            SELECT * FROM ticket
            WHERE isPaid = 'false'
            `

            database.query(query, async (err: any, result: TicketDatabase[]) => {
                if (err) {
                    log(`Error: ${err}`);
                    resolve(undefined);
                }
                resolve(result);
            });
        });
    }
    const deleteTicket = async (ticketKey: string, accountKey: string) => {
        return new Promise<boolean>(async (resolve) => {
            const accountData = await getAccountByKey(accountKey)
            const userData = await getUserByAccountKey(accountKey)
            if (!accountData || !userData) {
                log(`Error: Failed to get data`);
                return resolve(false)
            }
            const template = await findTemplate(accountData.nationality, "ticketDelete")
            if (!template) {
                log(`Error: Failed to get template`);
                return resolve(false)
            }

            const compiled = handlebars.compile(template.mail);
            const replacements = {
                fursonaName: userData.fursonaName,
            };
            const htmlToSend = compiled(replacements);
            template.mail = htmlToSend

            await sendMail({...template, address: accountData.email}, (err: string, result: string) => {
                if (err) {
                    log(`Error: Failed to send email`);
                    return resolve(false)
                }
            })

            const query = 
            `
            DELETE FROM ticket WHERE TicketKey = '${ticketKey}'
            `

            database.query(query, async (err: any) => {
                if (err) {
                    log(`Error: ${err}`);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    
    const unpaidTickets: TicketDatabase[] | undefined = await ticketQuery()
    const currentDate = new Date()
    let isError: boolean = false

    if (unpaidTickets != undefined && unpaidTickets.length) {
        let deletionCount = 0;
        for (let i=0; i < unpaidTickets.length; i++) {
            if (unpaidTickets[i].creationDate && unpaidTickets[i].TicketKey && !isError) {
                const ticketDate = new Date(unpaidTickets[i].creationDate!)
                
                if ((ticketDate.getTime() + (1000 * 60 * 60 * 24 * 8)) <= currentDate.getTime()) {
                    const deletionStatus = await deleteTicket(unpaidTickets[i].TicketKey!, unpaidTickets[i].AccountKey!)
                    if (!deletionStatus) isError = true
                    else deletionCount++
                }
            } 
        }

        if (!isError && !isProd) {
            log(`${deletionCount? deletionCount : 'No'} unpaid tickets have been deleted.`)
        }
    }
    else if (!unpaidTickets?.length && !isProd) {
        log(`No unpaid tickets have been deleted.`)
    }
    else {
        return;
    }
}

export default ticketLimitWatcher;