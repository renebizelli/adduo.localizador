import baseService from "./base.service";

import requestContextDto from "../dto/request-context.dto";

import mongoFactory from "../mongo/mongo.factory";
import locationDto from "../dto/location.dto";
import fenceCheckDto from "../dto/fence-check.dto";

class locationHistoryService extends baseService {

    private _locationMongo = mongoFactory.locationHistory();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    addLocation = async (locationDto: locationDto) => {
        return this._locationMongo.addLocation(locationDto);
    }

    addFence = async (fence: fenceCheckDto) => {
        return this._locationMongo.addFence(fence);
    }

}

export default locationHistoryService;