import timeStampHelper from "../helpers/timestamp.helper";
import dtoToDtoParser from "../parsers/dto-to-dto.parser";
import notificationManager from "./notification.manager";
import { cultureString } from "../enum/culture.enum";
import locale from "../locales/locale";
import notificationParser from "../parsers/notification.parse";
import mongoFactory from "../mongo/mongo.factory";
import userDto from "../dto/user.dto";
import historyService from "./history.service";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";

class userOverdueService {

    private _subscriptionMongo = mongoFactory.subscription();

    overdueMany = async () => {
        let ts = timeStampHelper.get();
        return this._subscriptionMongo.overdueMany(ts);
    }

    processOverdueUsers = async (): Promise<void> => {

        let users = await this.overdueMany();

        for (let user of users) {
            await this._subscriptionMongo.blockedOverdueUser(user.uid);
            await this.notification(user);
            await historyService.log(user.uid, historyTypeEnum.subscription, actionEnum.blocked);
        }
    }

    notification = async (user: userDto) => {

        let requestContextDto = dtoToDtoParser.userToRequestContext(user);

        let notification = new notificationManager(requestContextDto);

        let title = locale.get("text:plan-user-expired.title", <cultureString>user.culture);
        let body = locale.get("text:plan-user-expired.body", <cultureString>user.culture);

        let ts = timeStampHelper.get();

        let queueDtos = notificationParser.blockedUser([user.uid], title, body, ts);

        await notification.send(queueDtos)
    }

}

export default userOverdueService;