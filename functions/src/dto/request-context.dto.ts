import baseDto from "./base.dto";
import cultureEnum, { cultureString } from "../enum/culture.enum";

class requestContextDto
    extends baseDto {

    public culture: cultureString = cultureEnum.culture();
    public ts: string = '';
    public uid: string = '';
    public name: string = '';
    public email: string = '';

    constructor() {
        super()
    }
}

export default requestContextDto;