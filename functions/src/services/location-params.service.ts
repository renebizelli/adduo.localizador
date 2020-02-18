import locationBaseService from "./location-base.service";
import locationUpdateInterface from "../interfaces/location.update.interface";
import locationDto from "../dto/location.dto";
import validatorHelper from "../helpers/validator.helper";

class locationParamsService
    extends locationBaseService
    implements locationUpdateInterface {

    update(dto: locationDto): Promise<any> {
        this.validate(dto);
        return this._locationFirebase.updateParams(dto);
    }

    validate(dto: locationDto): void {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.deviceId, "error:generic.device");
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.battery, "error:location.battery");
    }

}

export default locationParamsService;