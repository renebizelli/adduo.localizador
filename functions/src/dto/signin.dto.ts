import baseDto from "./base.dto";
import userDto from "./user.dto";
import sessionDto from "./session.dto";

class signInDto
    extends baseDto {

    constructor() {
        super()
    }

    public user?: userDto;
    public session?: sessionDto;

}


export default signInDto