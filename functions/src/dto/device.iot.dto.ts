import deviceDto from "./device.dto";

class deviceIotDto
    extends deviceDto {

    public deviceId: string = '';
    public externalId: string = '';
    public token: string = '';

    constructor() {
        super();
    }

}

export default deviceIotDto;