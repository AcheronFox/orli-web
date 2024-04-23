import { IParticipant } from '@/models/participant.model';
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import _ from 'lodash';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data);
    }

    let response: IParticipant[] = [];
    const query = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT 
                attendee.nationalityId,
                fursona.name,
                fursona.species,
                fursona.pathToPictureFile,
                fursona.hasFursuit,
                ticket.sponsorLevel
            FROM
                attendee
                    INNER JOIN
                fursona ON attendee.fursonaId = fursona.id
                    AND attendee.verified = TRUE
                    INNER JOIN
                ticket ON attendee.ticketId = ticket.id
                    AND ticket.isPaid = TRUE;
            `;

            database.query(query, async (err: any, result: IParticipant[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "part_1"}); 
                    resolve(false);
                }
                response = result;
                resolve(true);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "part_2"});
        });
    }

    if (await query()) {
        sendResponse(200, _.orderBy(response, ['name'],['asc']));
    }
}