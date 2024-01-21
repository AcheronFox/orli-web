import { getUserByAccountKey } from '@/utils/getData';
import type { NextApiRequest, NextApiResponse } from 'next'
import isMethodAllowed from '@/functions/auth/isMethodAllowed';
import verifyToken from '@/functions/auth/veryifToken';
import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs'
import uniqueString from 'unique-string';
import database from '@/functions/utils/mysql';

export const config = {
    api: {
      bodyParser: false
    }
}

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isAllowed = await isMethodAllowed(req, res, 'POST')
    if (!isAllowed) return;

    const tokenPayload = await verifyToken(req, res);

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data)
    }

    if (tokenPayload) {
        const data: {err: any, fields: any, files: any} = await new Promise((resolve, reject) => {
            const form = formidable()
        
            form.parse(req, (err: any, fields: any, files: any) => {
                if (err) reject({ err })
                resolve({ err, fields, files })
            }) 
        })

        if (data) {
            const user = await getUserByAccountKey(tokenPayload.accountKey)

            if (user) {
                let name = user.fursonaName
                const picture = user.picture

                const cropData = JSON.parse(data.fields.crop)
                const { file } = data.files
                if (!file.mimetype.match(imageMimeType)) {
                    return sendResponse(400, {message: "File type not supported", e_code: "upload_1"}); 
                }
                const fileBuffer = fs.readFileSync(file.filepath);

                const croppedBuffer = await sharp(fileBuffer).extract({ width: Math.floor(cropData.width), height: Math.floor(cropData.height), left: Math.floor(cropData.x), top: Math.floor(cropData.y) }).toBuffer()

                let maxSizeBuffer: Buffer;
                let minSizeBuffer: Buffer;
                let thumbBuffer: Buffer;
                let extension = 'jpg'

                if (file.mimetype == 'image/png') {
                    maxSizeBuffer = await sharp(croppedBuffer).resize({width: 600, height: 600}).toBuffer()
                    minSizeBuffer = await sharp(maxSizeBuffer).resize({width: 300, height: 300}).toBuffer()
                    thumbBuffer = await sharp(maxSizeBuffer).resize({width: 100, height: 100}).toBuffer()    
                    extension = 'png'
                }
                else {
                    maxSizeBuffer = await sharp(croppedBuffer).flatten({ background: '#ffffff' }).resize({width: 600, height: 600}).toFormat('jpg').jpeg({quality: 70,chromaSubsampling: '4:4:4',force: true,}).toBuffer()
                    minSizeBuffer = await sharp(maxSizeBuffer).flatten({ background: '#ffffff' }).resize({width: 300, height: 300}).toFormat('jpg').jpeg({quality: 70,chromaSubsampling: '4:4:4',force: true,}).toBuffer()
                    thumbBuffer = await sharp(maxSizeBuffer).flatten({ background: '#ffffff' }).resize({width: 100, height: 100}).toFormat('jpg').jpeg({quality: 70,chromaSubsampling: '4:4:4',force: true,}).toBuffer()    
                }

                const uniqstr = uniqueString()
                if (picture) {
                    const path = `public/uploads/${picture.split('/')[0]}`
                    if (fs.existsSync(path)) {
                        fs.rmSync(path, { recursive: true })
                    }
                }

                name = name.replace(/\W/g, '').replaceAll(" ", "_")
                const folderPath = `public/uploads/${uniqstr}_${name}/`
                let filePath = `${uniqstr}_${name}/${name}`

                if (!fs.existsSync(folderPath)){
                    fs.mkdirSync(folderPath);
                }
                
                fs.writeFileSync(`public/uploads/${filePath}_x2.${extension}`, maxSizeBuffer)
                fs.writeFileSync(`public/uploads/${filePath}_x1.${extension}`, minSizeBuffer)
                fs.writeFileSync(`public/uploads/${filePath}_thumb.${extension}`, thumbBuffer)

                filePath = `${filePath}.${extension}`
                const updateDb = async () => {
                    return new Promise(async (resolve) => {
                        const query = 
                        `
                        UPDATE user SET picture = '${filePath}'
                        WHERE AccountKey = ?;
                        `
        
                        database.query(query, [tokenPayload.accountKey], async (err: any, result: any) => {
                            if (err) {
                                console.log("ERROR: ", err);
                                sendResponse(500, {message: "Unknown Error", e_code: "upload_2"}); 
                                resolve(false);
                            }
                            resolve(true);
                        });
                    }).catch(() => {
                        sendResponse(500, {message: "Unknown Error", e_code: "upload_3"}); 
                    });
                }

                if (await updateDb()) {
                    sendResponse(200, {message: "Uploaded"})
                }
            }
        }
    } else return;
}