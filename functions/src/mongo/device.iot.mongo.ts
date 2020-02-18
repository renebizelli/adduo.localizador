import deviceSchema from "../models/device.schema";

import dtoToModelParser from "../parsers/dto-to-model.parser";
import modelToDtoParser from "../parsers/model-to-dto.parser";
import deviceMongo from "./device.mongo";
import deviceIotDto from "../dto/device.iot.dto";
import deviceDto from "../dto/device.dto";

class deviceIotMongo extends deviceMongo {

    create = async (deviceIotDto: deviceIotDto) => {

        let model = dtoToModelParser.deviceIot(deviceIotDto);

        let device = await (new deviceSchema(model)).save();

        let dto = modelToDtoParser.device(device);

        return dto;
    }

    statusUpdate = async (device: deviceDto) => {

        let model = {
            status: device.status
        }

        return this._updateOne({ _id: device.deviceId }, model);
    }

}

export default deviceIotMongo;