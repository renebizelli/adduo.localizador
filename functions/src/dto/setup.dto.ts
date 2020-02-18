import baseDto from "./base.dto";
import cultureEnum, { cultureString } from "../enum/culture.enum";
import { platformsString } from "../enum/platform.enum";

class setupDto
    extends baseDto {

    public ts: number = 0;
    public deviceId: string = '';
    public platform: platformsString = platformsString.none;
    public culture: cultureString = cultureEnum.culture();
    public uid: string = '';

}

export default setupDto;