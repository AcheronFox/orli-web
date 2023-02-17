import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './token-handler';
import { isValidUUIDV4 } from 'is-valid-uuid-v4';
import jwt_decode from 'jwt-decode';
import { IToken } from '@/models/token.model';


const verifyToken = async (req: NextApiRequest, res: NextApiResponse) => {
    const authentication = await auth(res, req.cookies)
    if (authentication?.status != "OK") return;

    const verifyTokenPayload = (token: string) => {
        try {
            const payload: IToken = jwt_decode(token);
            const isValid = isValidUUIDV4(payload.accountKey)

            if (isValid) return payload;
            else return undefined;
        }
        catch (e) {
            return undefined;
        }
    }

    let decodedToken: IToken | undefined;
    if (authentication.data) decodedToken = verifyTokenPayload(authentication.data)
    else decodedToken = verifyTokenPayload(req.cookies.accessToken!)

    if (decodedToken) {
        return decodedToken;
    } else {
        res.status(400).json({ message: "Invalid Token Payload" });
        return undefined;
    }
}

export default verifyToken;