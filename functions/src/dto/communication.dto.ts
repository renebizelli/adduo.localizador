import baseDto from "./base.dto";
import { notificationTypesString } from "../enum/notification.enum";

class communicationDto extends baseDto {
    public uid: string = '';
    public communicationId: string = '';
    public sendedAt: number = 0;
    public type:notificationTypesString = notificationTypesString.none;
}

export default communicationDto;