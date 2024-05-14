import { generateCookies } from '@/functions/auth/token-handler';
import verifyToken from '@/functions/auth/veryifToken'
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from "@/functions/auth/isMethodAllowed";
import _ from 'lodash';
import resetPassword from "@/functions/auth/password-handler";
import { getFursona } from '@/services/fursona/service.fursona.select';
import { getAttendeeByAccountKey } from '@/services/attendee/service.attendee.select';
import { IFursonaUpdatable } from '@/models/newDbModels/updateModels/updatable.fursona.model';
import { updateFursona } from '@/services/fursona/service.fursona.update';
import { IFursona } from '@/models/newDbModels/fursona.model';
import { getDbConnection } from '@/functions/utils/databaseHelpers';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'PUT')
    if (!isAllowed) return;
    
    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        if (!req.body) {
            sendResponse(400, {message: "Missing data."});
            return;
        }

        const connection = await getDbConnection()

        const result = new Promise<boolean>(async (mainResolve) => {
            connection.beginTransaction(async (err) => {

                if (err) {
                    console.log("ERROR: ", err);
                    connection.release();
                    sendResponse(500, { message: "Error while creating the transaction.", e_code: "upd_2" });
                    return mainResolve(false);
                }

                const attendee = await getAttendeeByAccountKey(tokenPayload.accountKey)
                const fursona = await getFursona(attendee!.fursonaId)

                if (!attendee || !fursona) {
                    sendResponse(404, { message: "User not found", e_code: "upd_4" });
                    return mainResolve(false);
                } 

                const fursonPayload: IFursonaUpdatable = {}
                if (req.body.fursonaName && (req.body.fursonaName.trim() != "") && (req.body.fursonaName.trim().length <= 10)) {
                    fursonPayload.name = req.body.fursonaName;
                }
                else if (req.body.fursonaName != undefined) {
                    sendResponse(400, { message: "Wrong data", e_code: "upd_4" });
                    return mainResolve(false);
                }

                if (req.body.fursonaSpecies && (req.body.fursonaSpecies.trim() != "") && (req.body.fursonaSpecies.trim().length <= 10)) {
                    fursonPayload.species = req.body.fursonaSpecies;
                }
                else if (req.body.fursonaSpecies != undefined) {
                    sendResponse(400, { message: "Wrong data", e_code: "upd_4" });
                    return mainResolve(false);
                }

                if (req.body.isFursuiter != undefined) {
                    fursonPayload.hasFursuit = req.body.isFursuiter;
                }

                if (Object.keys(fursonPayload).length) {
                    const fursonaUpdate = await updateFursona({...fursona, ...fursonPayload} as IFursona, connection)

                    if (!fursonaUpdate) {
                        sendResponse(500, { message: "Insertion Failed.", e_code: "upd_3" });
                        return mainResolve(false);
                    }
                }


                if (req.body.password) {
                    const result = await resetPassword(req.body.password, tokenPayload.accountKey)
                    if (!result?.success) {
                        connection.rollback(function () {
                            sendResponse(500, { message: "Error Reseting Password", e_code: "upd_7" });
                            return mainResolve(false);
                        });
                        return;
                    } else {
                        const key = result.success
                        res.setHeader('Set-Cookie',
                            generateCookies("AUTO", key, req.cookies)
                            )
                    }
                }


                connection.commit(function (err) {
                    if (err) {
                        console.log(err)
                        connection.rollback(function () {
                            sendResponse(500, { message: "Error While Committing", e_code: "upd_8" });
                            return mainResolve(false);
                        });
                    } else {
                        connection.release();
                        return mainResolve(true);
                    }
                });
            });
        });

        
        if (await result) {
            sendResponse(200, {message: "Updated"})
        }
        else {
            connection.rollback(() => {
                connection.release();
            });
        }
    } else return;
}