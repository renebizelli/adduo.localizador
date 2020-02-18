import baseDto from "./base.dto";
import contactDto from "./contact.dto";

class monitorableSelectedToMapDto extends baseDto {
    public monitorableUid: string = '';
    public userUid: string = '';
    public alias: string = '';
    public deviceId: string = '';
    public contact?: contactDto;
}

export default monitorableSelectedToMapDto;
