import baseDto from "./base.dto";
import cultureEnum, { cultureString } from "../enum/culture.enum";

class monitoringAllowanceDto extends baseDto {
    public code: string = '';
    public uid: string = '';
    public culture: cultureString = cultureEnum.culture();
    public name: string = '';
    public productId: string = ''
    public subscriptionStatus: string = ''
    public selected: boolean = false;
}

export default monitoringAllowanceDto;