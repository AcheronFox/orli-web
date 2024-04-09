import { NextApiRequest, NextApiResponse } from "next";
import { checkDailyTicketValidity } from "@/services/dailyTicket/service.dailyticket.select";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>)
{
    try
    {
        throw new Error('debug')
        const answer = await checkDailyTicketValidity(2);


        // const results = await getNationalities();
        // if (results != undefined)
        // {
        //     for(let i = 0; i < results.length; i++)
        //     {
        //         console.log(results[i]);
        //     }
        // }


        res.status(200).send(answer);
    } catch (e: any)
    {
        res.status(500).send(e.message);
    }


    // const testAttendee: IAttendee = {
    //     accountKey: "hgueiwrgiuewhgerw",
    //     firstName: "Gipsz",
    //     lastName: "Jakab",
    //     email: "hahano.",
    //     password: "YesHello",
    //     dateOfBirth: "1999-01-01",
    //     allergy: "Andrew Tate",
    //     verified: false,
    //     admin: false,
    //     staff: false,
    //     fursonaId: 1,
    // }


    //const query = `UPDATE ${TABLE} SET firstName = ? WHERE id = ?;`;

    //const result = await executeUpdateQuery(query, ["Foxy", 3]);


    // const result = await postAttendee(testAttendee);
    // if (result)
    //     res.status(200).send(result);
    // res.status(500).send(result);

}