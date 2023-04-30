import { NextApiRequest, NextApiResponse } from 'next';

type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const isMethodAllowed = async (req: NextApiRequest, res: NextApiResponse, method: Methods) => {
    if (method !== req.method) {
        res.status(405).json({ message: `Method Not Allowed: ${req.method}` });
        return false;
    }
    else return true
}

export default isMethodAllowed;