import baseDto from './base.dto';
import cultureEnum, { cultureString } from '../enum/culture.enum';
import fenceMonitoredDto from './fence-monitored.dto';
import { fenceStatusString } from '../enum/fence.enum';

class fenceCheckResultDto extends baseDto {

    public _id: string = '';
    public radius: number = 0;
    public priority: number = 0
    public title: string = '';
    public uid: string = '';
    public distance: number = 0;
    public alias: string = '';
    public culture: cultureString = cultureEnum.culture();
    public monitored: fenceMonitoredDto = new fenceMonitoredDto();
    public canBeProcess: boolean = false;
    public newStatus: fenceStatusString = fenceStatusString.none;
}

export default fenceCheckResultDto;