import { fenceStatusString } from '../enum/fence.enum';
import cultureEnum, { cultureString } from '../enum/culture.enum';
import geoPointDto from './geo-point.dto';

class fenceCheckDto {
    public deviceId: string = '';
    public location:geoPointDto = new geoPointDto();
    public fenceId: string = '';
    public title: string = '';
    public uid: string = '';
    public monitorableUid: string = '';
    public alias: string = '';
    public priority: number = 0
    public status: fenceStatusString = fenceStatusString.none;
    public culture: cultureString = cultureEnum.culture();
    public occurredAt: number = 0;
}

export default fenceCheckDto;