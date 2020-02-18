import { platformsString } from "../enum/platform.enum";
import deviceDto from "./device.dto";

class deviceSmartphoneDto
    extends deviceDto {

    public platform?: platformsString;

    constructor() {
        super();
    }

}

export default deviceSmartphoneDto;