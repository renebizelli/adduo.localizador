import baseDto from "./base.dto";
import contactDto from "./contact.dto";

class monitoringMonitorableDto extends baseDto {
    public uid: string = '';
    public monitorableUid: string = '';
    public userUid: string = '';
    public alias: string = '';
    public deviceId: string = '';
    public active: boolean = false;
    public selected: boolean = false;
    public contact?: contactDto;
    public lockedUpTo: number = 0;
    public daysLeft: number = 0;
    public canBeChanged: boolean = false;
}

export default monitoringMonitorableDto;
