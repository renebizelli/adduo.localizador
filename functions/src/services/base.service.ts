import requestContextDto from "../dto/request-context.dto";
import logService from "./log.service";
import errorDto from "../dto/error.dto";
import historyService from "./history.service";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";

class baseService {

    public _context: requestContextDto;
    private _historyType: historyTypeEnum = historyTypeEnum.none;

    constructor(_context: requestContextDto, historyType?: historyTypeEnum) {
        this._context = _context;
        this._historyType = historyType || historyTypeEnum.none;
    }

    log(idType: string, error: errorDto, namespace: string): void {
        logService.logServiceError(this._historyType, idType, error, this._context.uid, namespace);
    }

    cl(title: string, o: any = null): void {
        console.log(">>>>> ", title, JSON.stringify(o));
    }

    history = async (action: actionEnum, _id?: string, afterObject?: any) => {
        return historyService.log(this._context.uid, this._historyType, action, _id, afterObject);
    }

    historyByUid = async (uid: string, action: actionEnum, _id?: string, afterObject?: any) => {
        return historyService.log(uid, this._historyType, action, _id, afterObject);
    }



}

export default baseService;