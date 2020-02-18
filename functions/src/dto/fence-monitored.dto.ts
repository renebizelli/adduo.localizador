import baseDto from "./base.dto";
import { fenceStatusString } from "../enum/fence.enum";

class fenceMonitoredDto
    extends baseDto {

    public userUid: string = '';
    public uid: string = '';
    public alias: string = '';
    public updatedAt: number = 0;
    public createdAt: number = 0;
    public status: fenceStatusString = fenceStatusString.none;


}

export default fenceMonitoredDto