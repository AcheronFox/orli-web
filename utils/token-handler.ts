import type { NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken';
import fs from 'fs'
import { getAccountByKey } from './getData';

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
        res.status(401).json({message: "Unauthorized"})
    }
    return response
}

const authScript = async (res: NextApiResponse, token: string) => {
    let verified = undefined;
    let response = undefined;

    try {
        if (!token) throw Error("No Token")
        verified = jwt.verify(token, publicKey, verifyOptions);
        response = {status: 'OK', data: undefined}
    }
    catch {
        response = {status: "INVALID", data: undefined}
    }

    if (response?.status != "OK") {
        res.status(401).json({message: "Unauthorized"})
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
            res.status(401).json({message: "Invalid Token"});
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
    
    switch(action) {
        case 'NEW':
            return [
                `publicToken=${generateJWT('public', key!)}; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `accessToken=${generateJWT('access', key!)}; HttpOnly; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `refreshToken=invalidated; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Samesite=Strict;`
            ]
        case 'NEWREMEMBER':
            return [
                `publicToken=${generateJWT('public', key!)}; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `accessToken=${generateJWT('access', key!)}; HttpOnly; Max-Age=43200; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`,
                `refreshToken=${generateJWT('refresh', key!)}; HttpOnly; Max-Age=1209600; Path=/; SameSite=Strict; ${(process.env.NODE_ENV !== 'development') ? 'Secure;' : ''}`
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


const generateJWT = (type: "public" | "access" | "refresh", key: string, customSignOptions?: jwt.SignOptions) => {
    switch(type) {
        case "public":
            return jwt.sign({accountKey: key}, privateKey, customSignOptions? customSignOptions : refreshTokenSignOptions);
        case "access":
            return jwt.sign({accountKey: key}, privateKey, customSignOptions? customSignOptions : accessTokenSignOptions);
        case "refresh":
            return jwt.sign({accountKey: key}, privateKey, customSignOptions? customSignOptions : refreshTokenSignOptions);
    }
}


const authAdmin = async (token: string) => {
    if (!token) return false

    const account = await getAccountByKey(token)

    if (account && account.isAdmin) {
        return true
    } else return false
}

export {auth, refresh, destroy, generateCookies, generateJWT, authAdmin, authScript, accessTokenSignOptions, refreshTokenSignOptions}