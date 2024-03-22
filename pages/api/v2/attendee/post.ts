import { NextApiRequest, NextApiResponse } from "next";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { postAttendee } from "@/services/attendee/service.attendee.post";

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>)
{
    console.log("hehe cats")

    const testAttendee: IAttendee = {
        id: 0,
        accountKey: "ahfuiofhfdasdas",
        firstName: "Gipsz",
        lastName: "Jakab",
        email: "hahano.",
        password: "YesHello",
        dateOfBirth: "1999-01-01",
        allergy: "Andrew Tate",
        verified: false,
        admin: false,
        staff: false,
        fursonaId: 1,
    }

    const result = await postAttendee(testAttendee);
    if (result)
        res.status(200).send(result);
    res.status(500).send(result);

}