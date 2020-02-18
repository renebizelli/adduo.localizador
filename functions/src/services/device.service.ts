import baseService from "./base.service";
import mongoFactory from "../mongo/mongo.factory";
import httpStatusHelper from "../helpers/http-status.helper";
import { historyTypeEnum } from "../enum/history.enum";
import requestContextDto from "../dto/request-context.dto";

class deviceService extends baseService {

    protected _deviceMongo = mongoFactory.device();

    constructor(_context: requestContextDto, type: historyTypeEnum) {
        super(_context, type);
    }

    one = async (deviceId: string) => {

        let dto = await this._deviceMongo.one(deviceId);

        if (dto) {
            return dto;
        }
        else {
            throw httpStatusHelper.notFound('error:device.smartphone.not-found');
        }
    }

}

export default deviceService;