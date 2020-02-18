import deviceSchema from "../models/device.schema";

import modelToDtoParser from "../parsers/model-to-dto.parser";
import { deviceStatusString } from "../enum/device.enum";

class deviceMongo {

    one = async (deviceId: string) => {

        let device = await this._findOne({ _id: deviceId });

        let dto = null;

        if (device) {
            dto = modelToDtoParser.device(device);
        }

        return dto;
    }

    delete = async (deviceId: string) => {
        return this._updateOne({ _id: deviceId }, { status : deviceStatusString.delete });
    }

    protected _updateOne = async (query: any, data: any) => {
        return deviceSchema.updateOne(query, data);
    }

    protected _findOne = async (query: any, projection?: any) => {
        return deviceSchema.findOne(query, projection);
    }

    protected _deleteOne = async (query: any) => {
        return deviceSchema.deleteOne(query);
    }


}

export default deviceMongo;