import deviceSchema from "../models/device.schema";

import deviceSmartphoneDto from "../dto/device.smartphone.dto";

import dtoToModelParser from "../parsers/dto-to-model.parser";
import modelToDtoParser from "../parsers/model-to-dto.parser";
import deviceMongo from "./device.mongo";

class deviceSmartphoneMongo extends deviceMongo {

    create = async (deviceSmartphoneDto: deviceSmartphoneDto) => {

        let model = dtoToModelParser.deviceSmartphone(deviceSmartphoneDto);

        let device = await (new deviceSchema(model)).save();

        let dto = modelToDtoParser.device(device);

        return dto;
    }

    update = async (deviceSmartphoneDto: deviceSmartphoneDto) => {

        let model = dtoToModelParser.deviceSmartphone(deviceSmartphoneDto);

        return this._updateOne({ _id: deviceSmartphoneDto.deviceId, userUid: deviceSmartphoneDto.userUid }, model);
    }

}

export default deviceSmartphoneMongo;