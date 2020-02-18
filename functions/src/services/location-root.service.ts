import locationBaseService from "./location-base.service";
import locationUpdateInterface from "../interfaces/location.update.interface";
import locationDto from "../dto/location.dto";
import validatorHelper from "../helpers/validator.helper";

class locationRootService
    extends locationBaseService
    implements locationUpdateInterface {

    constructor() {
        super()
    }


    update(dto: locationDto): Promise<any> {
        this.validate(dto);

        //##todo colocar historico
        this.cl("colocar history");
        return this._locationFirebase.updateRoot(dto);
    }

    validate(dto: locationDto): void {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.deviceId, "error:generic.device");
        validatorHelper.throwBadRequestIfInvalidGeoPoint(dto, "error:generic.position");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.accuracy, "error:location.accuracy");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.altitude, "error:location.altitude");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.direction, "error:location.direction");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.accuracyState, "error:location.accuracy-state");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.battery, "error:location.battery");
    }



}

export default locationRootService;