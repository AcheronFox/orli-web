// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.username == 'Fursang_Test' && req.body.pass == '3FMu0GMdcm3LNvr6rU3kuHN1XnNjFAJs+tLqtfw0D9I=') {
    res.status(200).json({message: "SUCCESS"})
    
  } else {
    res.status(403).json({message: "ACCESS DENIED"})
  }
  
}
