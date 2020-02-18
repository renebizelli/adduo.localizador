import baseDto from "./base.dto";
import { deviceTypesString, deviceStatusString } from "../enum/device.enum";

class deviceDto
    extends baseDto {

    public _id: string = '';
    public deviceId: string = '';
    public userUid: string = '';
    public alias: string = '';
    public type?: deviceTypesString;
    public status: deviceStatusString = deviceStatusString.none;

    constructor() {
        super();
    }

}

export default deviceDto;