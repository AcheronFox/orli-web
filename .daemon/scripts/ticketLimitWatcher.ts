import { ITicket } from "@/models/newDbModels/ticket.model";
import { getTicketsBasedOnPaymentStatus } from "@/services/ticket/service.ticket.select";
import { removeTicket } from "@/services/ticket/service.ticket.delete";

export async function ticketLimitWatcher(): Promise<number>
{
    const unpaidTickets: ITicket[] | undefined = await getTicketsBasedOnPaymentStatus(false);

    if (!unpaidTickets?.length)
        return 0;

    const currentDate = new Date();
    let deletionCount = 0;
    for (let i = 0; i < unpaidTickets.length; i++)
    {
        const ticketDate = new Date(unpaidTickets[i].createdAt!)
        
        if ((ticketDate.getTime() + (1000 * 60 * 60 * 24 * 8)) <= currentDate.getTime())
        {
            const result = await removeTicket(unpaidTickets[i]);
            if (result)
                deletionCount++;
            else
                throw (`Failed to remove ticket with id: ${unpaidTickets[i].id}`);
        }
    }

    return deletionCount;
}
export default ticketLimitWatcher;