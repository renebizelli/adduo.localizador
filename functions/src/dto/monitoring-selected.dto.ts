import baseDto from "./base.dto";

class monitoringSelectedDto extends baseDto {
    public monitorableUid: string = '';
    public allowedUid: string = '';
    public selectedAt : number = 0;
    public lockedUpTo : number = 0;
}

export default monitoringSelectedDto;