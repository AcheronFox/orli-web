import { NextApiRequest, NextApiResponse } from 'next';
import { auth, authScript } from './token-handler';
import { isValidUUIDV4 } from 'is-valid-uuid-v4';
import { jwtDecode } from 'jwt-decode';
import { IToken } from '@/models/token.model';


const verifyTokenPayload = (token: string) => {
    try {
        const payload: IToken = jwtDecode(token);
        const isValid = isValidUUIDV4(payload.accountKey)

        if (isValid) return payload;
        else return undefined;
    }
    catch (e) {
        return undefined;
    }
}

const verifyToken = async (req: NextApiRequest, res: NextApiResponse) => {
    const authentication = await auth(res, req.cookies)
    if (authentication?.status != "OK") return;

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

const verifyScript = async (token: string, res: NextApiResponse) => {
    const authentication = await authScript(res, token)
    if (authentication?.status != "OK") return;

    let decodedToken: IToken | undefined;
    decodedToken = verifyTokenPayload(token)

    if (decodedToken) {
        return decodedToken;
    } else {
        res.status(400).json({ message: "Invalid Token Payload" });
        return undefined;
    }
}

export default verifyToken;
export {verifyScript}