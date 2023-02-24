import type { NextApiRequest, NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken';
import fs from 'fs'

const publicKey = fs.readFileSync('private/public.key', 'utf8');
const privateKey = fs.readFileSync('private/private.key', 'utf8');

const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    algorithm: ["RS256"]
};

const accessTokenSignOptions: jwt.SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    expiresIn: "12h",
    algorithm: "RS256"
};
const refreshTokenSignOptions: jwt.SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.DOMAIN_ROOT,
    expiresIn: "2w",
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
        const accessToken = jwt.sign(payload, privateKey, accessTokenSignOptions);
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
            generateCookies('DESTROY')
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




const generateCookies = (action: 'NEW' | 'NEWREMEMBER' | 'DESTROY' | 'AUTO' = 'AUTO', key?: string, tokens?: Partial<{ [key: string]: string; }>) => {
    const decideAction = () => {
        if (!tokens) {
            throw new Error("No tokens provided")
        }
        const accessToken = tokens.accessToken
        const refreshToken = tokens.refreshToken
        const publicToken = tokens.publicToken

        if (accessToken && refreshToken && publicToken) {
            action = 'NEWREMEMBER'
        }
        else if (accessToken && publicToken) {
            action = 'NEW'
        }
        else {
            action = 'DESTROY'
        }
    }
    
    if (action == 'AUTO') {
        decideAction()
    }

    const sign = (type: "public" | "access" | "refresh") => {
        switch(type) {
            case "public":
                return jwt.sign({accountKey: key}, privateKey, refreshTokenSignOptions);
            case "access":
                return jwt.sign({accountKey: key}, privateKey, accessTokenSignOptions);
            case "refresh":
                return jwt.sign({accountKey: key}, privateKey, refreshTokenSignOptions);
        }
    }
    
    switch(action) {
        case 'NEW':
            return [
                `publicToken=${sign('public')}; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `accessToken=${sign('access')}; HttpOnly; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `refreshToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`
            ]
        case 'NEWREMEMBER':
            return [
                `publicToken=${sign('public')}; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `accessToken=${sign('access')}; HttpOnly; Max-Age=43200; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `refreshToken=${sign('refresh')}; HttpOnly; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`
            ]
        case 'DESTROY':
        default:
            return [
                `publicToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`,
                `accessToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`,
                `refreshToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`
            ]
    }
}

export {auth, refresh, destroy, generateCookies, accessTokenSignOptions, refreshTokenSignOptions}