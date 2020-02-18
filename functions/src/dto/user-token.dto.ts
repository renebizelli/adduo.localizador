import baseDto from "./base.dto";
import { platformsString } from "../enum/platform.enum";

class userTokenDto extends baseDto {
    public token: string = '';
    public platform: platformsString = platformsString.none;

}

export default userTokenDto;