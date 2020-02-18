import baseDto from "./base.dto";

import cultureEnum from "../enum/culture.enum";
//import { userStatus } from "../enum/user.enum";
import { platformsString } from "../enum/platform.enum";

class userDto
    extends baseDto {

    public uid: string = '';
    public name: string = '';
    public email: string = '';
    public phone: string = '';
    public password: string = '';
    public platform: platformsString = platformsString.none;
    public culture: string = cultureEnum.culture();
    public createdAt: number = 0;
    //public subscription: userStatus = userStatus.none;

    constructor() {
        super()
    }



}

export default userDto