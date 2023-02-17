import type { NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken';
import fs from 'fs'

const publicKey = fs.readFileSync('private/public.key', 'utf8');
const privateKey = fs.readFileSync('private/private.key', 'utf8');

const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    algorithm: ["RS256"]
};

const accessSignOptions: jwt.SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    expiresIn: "12h",
    algorithm: "RS256"
};

const isJWTPayload = (object: any): object is jwt.JwtPayload => {
    return "iss" in object;
}

const auth = async (res: NextApiResponse, tokens: Partial<{ [key: string]: string; }>) => {
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;
    const publicToken = tokens.publicToken;
    let verified = undefined;
    let response = undefined;

    if (!publicToken) {
        response = await destroy(res)
    } else {
        try {
            if (!accessToken) throw Error("No Token")
            verified = jwt.verify(accessToken, publicKey, verifyOptions);
            response = {status: 'OK', data: undefined}
        }
        catch {
            if (refreshToken) {
                response = await refresh(res, refreshToken)
            }
            else {
                response = await destroy(res)
            }
        }
    }

    if (response?.status != "OK") {
        res.status(201).json({message: "Unauthorized"})
    }
    return response
}

const refresh = async (res: NextApiResponse, refreshToken: string, isOutsideCall = false) => {
    let response = undefined;
    let verified = undefined;

    try {
        verified = jwt.verify(refreshToken, publicKey, verifyOptions);
    }
    catch {
        response = await destroy(res)
    }

    if (verified && isJWTPayload(verified)) {
        const payload = {
            accountKey: verified.accountKey
        }
        const accessToken = jwt.sign(payload, privateKey, accessSignOptions);
        res.setHeader(
            'Set-Cookie',
            [
                `accessToken=${accessToken}; HttpOnly; Max-Age=43200; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
            ]
        )
        response = {status: "OK", data: accessToken}
    }
    if (isOutsideCall) {
        if (response?.status == "OK") {
            res.status(200).json({message: "Refresh Successful"})
        }
        else {
            res.status(201).json({message: "Invalid Token"});
        }
    }
    else return response;
}

const destroy = async (res: NextApiResponse, isOutsideCall = false) => {
    let response = undefined;

    try {
        res.setHeader(
            'Set-Cookie',
            [
                `publicToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`,
                `accessToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`,
                `refreshToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`
            ]
        )
        response = {status: "INVALID", data: undefined}
    }
    catch {
        response = {status: "INVALID", data: undefined}
    }
    if (isOutsideCall) {
        res.status(200).json({message: "Logged Out"})
    }
    else return response;
}

export {auth, refresh, destroy}