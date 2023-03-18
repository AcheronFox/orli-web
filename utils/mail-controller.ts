import nodemailer from "nodemailer"
import path from "path";
import fs from "fs";

type Props = {
    mail: string
    title: string
    address: string
}

const sendMail = async (props: Props, cb: Function) => {
    try {
        const isProd = process.env.NODE_ENV === "production"
        let transporter = undefined

        if (isProd) {
            transporter = nodemailer.createTransport({
                host: "live.smtp.mailtrap.io",
                port: 587,
                auth: {
                  user: process.env.MAIL_USER || '',
                  pass: process.env.MAIL_PASS || '',
                  type: "LOGIN",
                }
            });
        }
        else {
            transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.MAIL_DEV_USER || '',
                  pass: process.env.MAIL_DEV_PASS || '',
                }
            });
        }

        const mailOptions = {
            from: process.env.MAIL_ADDRESS,
            to: props.address,
            subject: props.title,
            html: props.mail
        };

        await writeMailLimit(await getMailLimit()-1)
        await transporter.sendMail(mailOptions);
    }
    catch(e) {
        console.log(e)
        cb('error', null);
        return;
    }
    
    cb(null, 'success');
}





type TemplateResult = {
    mail: string
    title: string
    address: string
}

const findTemplate = async (nationality: string, template: string) => {
    const locale = path.join(`${process.cwd()}/emails/`, nationality, '/')
    const templateFile = `${template}.html`
    const titleFile = `${template}.txt`

    let res: TemplateResult | undefined = {
        mail: '',
        title: '',
        address: ''
    }
    if (fs.existsSync(locale)) {
        try {
            res.mail = fs.readFileSync(path.join(locale, templateFile), {encoding: 'utf-8'})
            res.title = fs.readFileSync(path.join(locale, titleFile), {encoding: 'utf-8'})
        }
        catch(e) {
            res = undefined
        }
    }
    else {
        //Use fallback locale
        const fallback = path.join(`${process.cwd()}/emails/en/`)
        try {
            res.mail = fs.readFileSync(path.join(fallback, templateFile), {encoding: 'utf-8'})
            res.title = fs.readFileSync(path.join(fallback, titleFile), {encoding: 'utf-8'})
        }
        catch(e) {
            console.log(e)
            res = undefined
        }
    }
    
    return res
}


const getMailLimit = async () => {
    const filePath = path.join(`${process.cwd()}`, "utils/shared.json")
    const rawdata = fs.readFileSync(filePath);
    const sharedVariables = JSON.parse(rawdata.toString());

    return sharedVariables.mailCount
}
const writeMailLimit = async (input: number) => {
    const dataToWrite = {
        mailCount: input
    }

    const filePath = path.join(`${process.cwd()}`, "utils/shared.json")
    const data = JSON.stringify(dataToWrite, null, 2);
    fs.writeFileSync(filePath, data);
}

export { sendMail, findTemplate, getMailLimit, writeMailLimit };