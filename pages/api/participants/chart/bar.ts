import { IBarChart } from './../../../../models/chart.model';
import type { NextApiRequest, NextApiResponse } from 'next'
import database from '@/functions/utils/mysql'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';

const getAge = (birthday: string) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
  
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const groupBy = (list: any[], keyGetter: Function) => {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

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

    let response: IBarChart = {
        nationality: [],
        age: [],
    };
    const query = async () => {
        return new Promise(async (resolve) => {
            let query = 
            `
            SELECT 
                attendee.nationalityId,
                COUNT(attendee.nationalityId) AS natCount
            FROM
                attendee
                    INNER JOIN
                fursona ON attendee.fursonaId = fursona.id
                    AND attendee.verified = 1
                    INNER JOIN
                ticket ON attendee.ticketId = ticket.id
                    AND ticket.isPaid = 1
            GROUP BY attendee.nationalityId;
            `;

            database.query(query, async (err: any, result: IBarChart['nationality']) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "bar_1"}); 
                    resolve(false);
                }
                response.nationality = result;
                resolve(true)
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "bar_2"}); 
        });
    }

    const query2 = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT 
                attendee.dateOfBirth
            FROM
                attendee
                    INNER JOIN
                fursona ON attendee.fursonaId = fursona.id
                    AND attendee.verified = 1
                    INNER JOIN
                ticket ON attendee.ticketId = ticket.id
                    AND ticket.isPaid = 1;
            `;

            database.query(query, async (err: any, result: {dateOfBirth: string}[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "bar_3"}); 
                    resolve(false);
                }
                let tempArr: number[] = [];
                result.forEach((item) => {
                    tempArr.push(getAge(item.dateOfBirth))
                })

                const counts = tempArr.reduce((a: any, v) => {
                    a[v] = (a[v] ?? 0) + 1;
                    return a;
                }, {});
                
                let tempResult: any = []
                Object.keys(counts).forEach((key: string) => {
                    let obj = {
                        age: key,
                        count: counts[key]
                    }
                    tempResult.push(obj)
                })

                response.age = tempResult;
                resolve(true);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "bar_2"}); 
        });
    }

    if (await query() && await query2()) {
        sendResponse(200, response);
    }
}