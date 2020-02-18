import baseMongo from "./base.mongo";
import locationDto from "../dto/location.dto";
import fenceCheckDto from "../dto/fence-check.dto";
import dtoToModelParser from "../parsers/dto-to-model.parser";
import locationHistorySchema from "../models/location-history.schema";

class locationHistoryMongo extends baseMongo {

    addLocation = async (locationDto: locationDto) => {

        let model = dtoToModelParser.locationHistory(locationDto);

        return this._updateOne({ _id: locationDto.uid },
            {
                $push: {
                    location: model
                }
            });

    }

    addFence = async (fence: fenceCheckDto) => {

        let model = dtoToModelParser.fenceHistory(fence);

        await this._updateOne({ _id: fence.monitorableUid },
            {
                $push: {
                    fence: model
                }
            });

    }

    private _updateOne = async (query: any, data: any) => {
        return locationHistorySchema.updateOne(query, data, { upsert: true });
    }


}

export default locationHistoryMongo;