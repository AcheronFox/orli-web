import type { NextApiRequest, NextApiResponse } from 'next'
import { destroy } from '@/utils/token-handler';
import isMethodAllowed from '@/utils/isMethodAllowed';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'GET')
    if (!isAllowed) return;

    await destroy(res, true);
}