// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/utils/isMethodAllowed';
import { authAdmin } from '@/utils/token-handler';
import { verifyScript } from '@/utils/veryifToken';
import database from '@/utils/mysql';
import { json2csv } from 'json-2-csv';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return

    const tokenPayload = await verifyScript(req.body.accessToken, res);
    
    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        const isAdmin = await authAdmin(tokenPayload.accountKey)
        if (!isAdmin) return sendResponse(401, "Unauthorized")

        const queryAccount = async () => {
            return new Promise<any[] | undefined>(async (resolve) => {
                const query = 
                `
                SELECT * FROM account
                `

                database.query(query, async (err: any, result: any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "export_1"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "export_2"});
                return undefined
            });
        }
        const queryUser = async () => {
            return new Promise<any[] | undefined>(async (resolve) => {
                const query = 
                `
                SELECT * FROM user
                `

                database.query(query, async (err: any, result: any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "export_3"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "export_4"});
                return undefined
            });
        }
        const queryTicket = async () => {
            return new Promise<any[] | undefined>(async (resolve) => {
                const query = 
                `
                SELECT * FROM ticket
                `

                database.query(query, async (err: any, result: any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "export_5"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "export_6"});
                return undefined
            });
        }
        const queryAccomodation = async () => {
            return new Promise<any[] | undefined>(async (resolve) => {
                const query = 
                `
                SELECT * FROM accomodation
                `

                database.query(query, async (err: any, result: any[]) => {
                    if (err) {
                        console.log("ERROR: ", err);
                        sendResponse(500, {message: "Unknown Error", e_code: "export_7"}); 
                        resolve(undefined);
                    }
                    resolve(result);
                });
            }).catch(() => {
                sendResponse(500, {message: "Unknown Error", e_code: "export_8"});
                return undefined
            });
        }

        const accounts: any[] | undefined = await queryAccount()
        const users: any[] | undefined = await queryUser()
        const tickets: any[] | undefined = await queryTicket()
        const accomodations: any[] | undefined = await queryAccomodation()

        if ((accounts != undefined) && (users != undefined) && (tickets != undefined) && (accomodations != undefined)) {
            let objArr = []
            try {
                for (let i=0; i < accounts.length; i++) {
                    let tempObj = {...accounts[i]}
                    const user = users.find((o) => o.AccountKey == accounts[i].AccountKey)
                    const ticket = tickets.find((o) => o.AccountKey == accounts[i].AccountKey)
                    const accomodation = accomodations.find((o) => o.AccountKey == accounts[i].AccountKey)
    
                    if (user) {
                        tempObj = {...tempObj, ...user, picture: user.picture? `${process.env.DOMAIN_ROOT}uploads/${user.picture.split('.')[0]}_x2.${user.picture.split('.')[1]}` : null}
                    }
                    if (ticket) {
                        tempObj = {...tempObj, ...ticket, ticketCreationDate: ticket.creationDate}
                    }
                    if (accomodation) {
                        tempObj = {...tempObj, ...accomodation}
                    }
                    tempObj.id = accounts[i].id
                    objArr.push(tempObj)
                }
                
                objArr.forEach((item) => {
                    delete item['password']
                })

                const csv = await json2csv(objArr);
                sendResponse(200, {"csv": csv, "json": objArr});
            }
            catch(e) {
                console.log(e)
                sendResponse(500, {message: "Failed to generate export", e_code: "export_9"});
            }
        }
    } else return;
}