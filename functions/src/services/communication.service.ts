import requestContextDto from "../dto/request-context.dto";
import baseService from "./base.service";
import serviceFactory from "./service.factory";
import notificationParser from "../parsers/notification.parse";
import { notificationTypesString } from "../enum/notification.enum";
import timeStampHelper from "../helpers/timestamp.helper";
import { alertPriority } from "../enum/alert.enum";
import mongoFactory from "../mongo/mongo.factory";
import locale from "../locales/locale";
import communicationDto from "../dto/communication.dto";

class communicationService extends baseService {

    private _userMongo = mongoFactory.user();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    static createCountdownFreeUserKey(daysLeft: number) {
        return notificationTypesString.countdownFreeUser + '-' + daysLeft;
    }

    sendCountdownFreeUser = async (daysLeft: number) => {

        let ts = timeStampHelper.get();
        let communicationId = communicationService.createCountdownFreeUserKey(daysLeft);

        let title = locale.getText("countdown-free-user.title", this._context.culture);
        let body = locale.getText("countdown-free-user.body", this._context.culture);
        body = body.stringFormat([daysLeft.toString()]);

        await this.send(title, body, ts, alertPriority.default, notificationTypesString.countdownFreeUser);
        await this.registerSended(communicationId, ts, notificationTypesString.countdownFreeUser);
    }

    send = async (title: string, body: string, sendedAt: number, priority: number, type: notificationTypesString) => {
        const notificationManager = serviceFactory.notification(this._context);
        let notification = notificationParser.generic(this._context.uid, title, body, sendedAt, type, priority);
        await notificationManager.send(notification)
    }

    registerSended = async (communicationId: string, sendedAt: number, type: notificationTypesString) => {

        let dto: communicationDto = {
            uid: this._context.uid,
            communicationId: communicationId,
            sendedAt: sendedAt,
            type: type
        }

        await this._userMongo.communicationSendedAdd(dto);
    }


}

export default communicationService;