import baseDto from "./base.dto";
import { notificationTypesString } from "../enum/notification.enum";
import { alertPriority } from "../enum/alert.enum";

class notificationAlertDto extends baseDto {
    public uid: string = '';
    public title: string = '';
    public monitoredUid: string = '';
    public userUid: string = '';
    public body: string = '';
    public type: notificationTypesString = notificationTypesString.none;
    public idType: string = '';
    public occurredAt: number = 0;
    public priority : number = alertPriority.default;
}

export default notificationAlertDto;