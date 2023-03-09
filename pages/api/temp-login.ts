// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.username == 'Orli_Test' && req.body.pass == 'n3RFeqULLP+vAEVIkTAsCIMGhnlZLz54WCerUxCw5Cg=') {
    res.status(200).json({message: "SUCCESS"})
    
  } else {
    res.status(403).json({message: "ACCESS DENIED"})
  }
  
}
