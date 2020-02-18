import platformEnum from "../enum/platform.enum";

import httpStatusHelper from "../helpers/http-status.helper";
import validatorHelper from "../helpers/validator.helper";

import deviceSmartphoneDto from "../dto/device.smartphone.dto";
import mongoFactory from "../mongo/mongo.factory";
import requestContextDto from "../dto/request-context.dto";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";
import deviceService from "./device.service";
import { deviceStatusString } from "../enum/device.enum";
import firebaseFactory from "../firebase/firebase.factory";

class deviceSmartphoneService
    extends deviceService {

    private _deviceSmartphoneMongo = mongoFactory.deviceSmartphone();
    private _deviceFirebase = firebaseFactory.location();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.deviceSmartphone);
    }

    create = async (deviceSmartphoneDto: deviceSmartphoneDto) => {

        this._validateCreate(deviceSmartphoneDto);

        deviceSmartphoneDto.status = deviceStatusString.active;

        let dto = await this._deviceSmartphoneMongo.create(deviceSmartphoneDto);

        await this.history(actionEnum.create, dto._id, deviceSmartphoneDto);

        return dto;
    }

    update = async (deviceSmartphoneDto: deviceSmartphoneDto) => {

        this._validateCreate(deviceSmartphoneDto);

        deviceSmartphoneDto.status = deviceStatusString.active;

        let result = await this._deviceSmartphoneMongo.update(deviceSmartphoneDto);

        if (validatorHelper.isNullOrEmpty(result)) {
            throw httpStatusHelper.notFound();
        }

        await this.history(actionEnum.update, deviceSmartphoneDto._id, deviceSmartphoneDto);

        return;
    }

    delete = async (deviceId: string) => {
        await this._deviceMongo.delete(deviceId);
        await this._deviceFirebase.delete(deviceId);
    }    

    private _validateCreate(deviceSmartphoneDto: deviceSmartphoneDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(deviceSmartphoneDto.alias, 'error:device.smartphone.form.alias');
        validatorHelper.throwBadRequestIfTrue(!platformEnum.containPlatform(deviceSmartphoneDto.platform), 'error:generic.platform')
    }

 

}

export default deviceSmartphoneService;