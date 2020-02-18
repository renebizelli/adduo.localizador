import emailQueueDto from "../dto/email.queue.dto";
import firebaseFactory from "../firebase/firebase.factory";
import userDto from "../dto/user.dto";
import locale from "../locales/locale";
import { cultureString } from "../enum/culture.enum";
import * as nodemailConfig from "../config/nodemailer.config.json";
import * as nodemailer from "nodemailer";
import * as fs from "fs"
import * as path from "path";

class emailService {

    private emailFirebase = firebaseFactory.email();

    constructor() {
    }

    registerQueue = async (user: userDto) => {
        var title = locale.getText("email.register.title", <cultureString>user.culture);
        var message = locale.getTextWithComplement("email.register.message", <cultureString>user.culture, [user.name]);
        let email = new emailQueueDto(user.name, user.email, title, message);

        await this.send(email)

        return this.queue(email);
    }

    private queue = async (dto: emailQueueDto) => {
        return this.emailFirebase.queue(dto);
    }

    send = async (dto: emailQueueDto) => {

        try {

            var sender = nodemailer.createTransport(nodemailConfig);

            let mail = {
                from: nodemailConfig.fromAccount,
                to: dto.email,
                subject: dto.title,
                html: ''
            };

            let html = await this.htmlEmailOne();

            mail.html = html.replace('##BODY##', dto.message)

            await sender.sendMail(mail);

            if (dto.key) {
                await this.emailFirebase.delete(dto.key);
            }

        }
        catch (error) {
            console.log(error)
        }

    }

    private htmlEmailOne = async (): Promise<string> => {
        return new Promise((resolve, reject) => {

            let file = path.resolve(__dirname, '../email-template/generic.html');

            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

}

export default emailService;