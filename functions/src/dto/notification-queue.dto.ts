import { notificationTypesString } from '../enum/notification.enum';
import baseDto from './base.dto';

class notificationQueueDto extends baseDto {
    public key: string = '';
    public uid: string = '';
    public title: string = '';
    public body: string = '';
    public occurredAt: number = 0;
    public type: notificationTypesString = notificationTypesString.none;
    public monitoredUid: string = ''
    public idType: string = ''
    public priority: number = 0;
    public try: number = 0;
    public error: any;

}

export default notificationQueueDto;