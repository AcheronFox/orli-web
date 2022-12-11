// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = `
  ERROR 403
  Forbidden
  You are attempting to access operational data, please return to ${req.headers.host}
  `
  res.status(403).send(body)
}
