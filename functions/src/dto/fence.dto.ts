import baseDto from "./base.dto";
import geoPointInterface from "../interfaces/geo-point.interface";
import geoPointDto from "./geo-point.dto";
import { fencePriority } from "../enum/fence.enum";
import fenceMonitoredDto from "./fence-monitored.dto";

class fenceDto
    extends baseDto
    implements geoPointInterface {

    public _id: string = '';
    public location: geoPointDto = new geoPointDto();
    public lat: number = 0;
    public lng: number = 0;
    public radius: number = 0;
    public priority: fencePriority = fencePriority.normal;
    public monitoredIds: string[] = [];
    public monitored: fenceMonitoredDto[] = [];
    public userUid: string = '';
    public address: string = '';
    public title: string = '';
    public active: boolean = false;
    public createdAt: number = 0
    public numberOfMonitoreds: number = 0;

}

export default fenceDto;