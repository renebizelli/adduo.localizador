import baseDto from "./base.dto";
import { typeLocationIotEnum } from "../enum/type-location-iot.enum";
import geoPointDto from "./geo-point.dto";
import geoPointInterface from "../interfaces/geo-point.interface";

class locationDto 
extends baseDto
implements geoPointInterface {
    public uid: string = '';
    public deviceId: string = '';
    public location:geoPointDto = new geoPointDto();
    public direction: number = 0;
    public altitude: number = 0;
    public speed: number = 0;
    public accuracy: number = 0;
    public updatedAt: number = 0;
    public battery: number = 0;
    public accuracyState:string = '';
    public type?: typeLocationIotEnum;

}

export default locationDto;