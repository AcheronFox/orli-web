// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentDate = Math.floor((new Date().getTime()) / 1000);
  res.status(200).json({timeLeft: currentDate + 60})
}
