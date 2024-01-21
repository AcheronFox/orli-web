import type { NextApiRequest, NextApiResponse } from 'next'
import { destroy } from '@/functions/auth/token-handler';
import isMethodAllowed from '@/functions/auth/isMethodAllowed';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return;

    await destroy(res, true);
}