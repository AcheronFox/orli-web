import { ITicket } from "@/models/newDbModels/ticket.model";
import { getTicketsBasedOnPaymentStatus } from "@/services/ticket/service.ticket.select";
import { removeTicket } from "@/services/ticket/service.ticket.delete";
import { findTemplate, sendMail } from "@/functions/mail/mail-controller";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { getAttendees } from "@/services/attendee/service.attendee.select";
import { INationality } from "@/models/newDbModels/nationality.model";
import handlebars from "handlebars";
import { getFursona } from "@/services/fursona/service.fursona.select";

export async function ticketLimitWatcher(): Promise<number>
{
    const unpaidTickets: ITicket[] | undefined = await getTicketsBasedOnPaymentStatus(false);
    const attendees: IAttendee[] | undefined = await getAttendees();

    if (!unpaidTickets?.length)
        return 0;

    const attendeesWithTickets: IAttendee[] = attendees?.filter(attendee => 
        unpaidTickets?.some(ticket => ticket.id === attendee.ticketId)) ?? [];

    const currentDate = new Date();
    let deletionCount = 0;
    for (let i = 0; i < unpaidTickets.length; i++)
    {
        const ticketDate = new Date(unpaidTickets[i].createdAt!)
        
        if ((ticketDate.getTime() + (1000 * 60 * 60 * 24 * 7)) <= currentDate.getTime())
        {
            const attendee = attendeesWithTickets?.find(attendee => attendee.ticketId ===
                unpaidTickets[i].id) ?? null;
            
            if (attendee == null) {
                throw ("Cannot find attendee with this ticket!");
            }

            const fursona = await getFursona(attendee.fursonaId);
            if (fursona == undefined)
                throw ("Fursona not found");

            await sendEmail((attendee.nationalityId == 25) ? "hu" : "en", attendee.email, fursona.name);

            const result = await removeTicket(unpaidTickets[i]);
            if (result)
                deletionCount++;
            else
                throw (`Failed to remove ticket with id: ${unpaidTickets[i].id}`);
        }
    }

    return deletionCount;
}

async function sendEmail(nationality: string, email: string, fursonaName: string) {
    const template = await findTemplate(nationality, "ticketDelete")
    if (!template) {
        throw (`Error: Failed to get template, ticketLimitWatcher 02`);
    }

    const compiled = handlebars.compile(template.mail);
    const replacements = {
        fursonaName: fursonaName,
    };
    const htmlToSend = compiled(replacements);
    template.mail = htmlToSend

    await sendMail({ ...template, address: email }, (err: string, result: string) => {
        if (err) {
            throw (`Error: Failed to send email, ticketLimitWatcher 03`);
        }
    })
}

export default ticketLimitWatcher;