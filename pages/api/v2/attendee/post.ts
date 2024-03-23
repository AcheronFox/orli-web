import { NextApiRequest, NextApiResponse } from "next";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { postAttendee } from "@/services/attendee/service.attendee.insert";
import { executeUpdateQuery } from "@/functions/utils/databaseHelpers";
import { modifyAttendee } from "@/services/attendee/service.attendee.update";
import {MysqlError} from "mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>)
{
    const testAttendee: IAttendee = {
        id: 3,
        accountKey: "nono22",
        firstName: "Gipsz",
        lastName: "Jakab",
        email: "hahano.",
        password: "YesHello",
        dateOfBirth: "1999-01-01",
        allergy: "Andrew Tate",
        verified: true,
        admin: false,
        staff: false,
        fursonaId: 3,
    }

    try
    {
        const result = await modifyAttendee(testAttendee);

        res.status(200).send(result);
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