import baseDto from "./base.dto";

class monitorableSelectedToAccountDto extends baseDto {
    public monitorableUid: string = '';
    public userUid: string = '';
    public alias: string = '';
    public daysLeft: number = 0;
    public canBeChanged: boolean = false;
    public lockedUpTo : number = 0;
}

export default monitorableSelectedToAccountDto;
