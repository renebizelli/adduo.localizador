import locationBaseService from "./location-base.service";
import locationUpdateInterface from "../interfaces/location.update.interface";
import validatorHelper from "../helpers/validator.helper";
import locationDto from "../dto/location.dto";

class locationLocationService
    extends locationBaseService
    implements locationUpdateInterface {

    constructor() {
        super()
    }


    async update(dto: locationDto): Promise<void> {

        this.validate(dto);

        await this._locationFirebase.updateLocation(dto);
        await this._locationHistoryMongo.addLocation(dto);
    }

    validate(dto: locationDto): void {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.deviceId, "error:generic.device");
        validatorHelper.throwBadRequestIfInvalidGeoPoint(dto, "error:generic.position");
    }
}

export default locationLocationService;