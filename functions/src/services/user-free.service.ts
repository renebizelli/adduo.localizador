import serviceFactory from "./service.factory";
import timeStampHelper from "../helpers/timestamp.helper";
import queryParamsParser from "../parsers/query-params.parser";
import mongoFactory from "../mongo/mongo.factory";
import dtoToDtoParser from "../parsers/dto-to-dto.parser";
import communicationService from "./communication.service";
import { productEnumString } from "../enum/product.enum";

class userFreeService {

    private _constantService = serviceFactory.constant();
    private _subscriptionMongo = mongoFactory.subscription();

    countdownCommunication = async () => {

        let daysLeft = await this._constantService.getCountdownFreeUserDayLeft()
        let ts = timeStampHelper.get();

        for (let days of daysLeft) {
            let communicationId = communicationService.createCountdownFreeUserKey(days)
            let params = queryParamsParser.toCountdownFreeUser(
                days,
                ts,
                timeStampHelper.oneDay(),
                communicationId,
                productEnumString.free);

            let users = await this._subscriptionMongo.countdownFreeUserMany(params);

            for (let user of users) {
                let context = dtoToDtoParser.userToRequestContext(user);
                let communicationService = serviceFactory.communication(context);
                await communicationService.sendCountdownFreeUser(days);
            }

        }
    }
}

export default userFreeService;