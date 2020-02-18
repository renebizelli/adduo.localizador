import mongoFactory from "../mongo/mongo.factory";
import { constantString } from "../enum/constant.enum";

class constantService {

    private _constantMongo = mongoFactory.constant();

    getDeviceIotActivation = async () => {
        return this._getAny(constantString.deviceIotActivation)
    }

    getCountdownFreeUserDayLeft = async () => {
        return this._getListNumber(constantString.countdownFreeUserDayLeft)
    }

    getFreeDaysAllowed = async () => {
        return this._getNumber(constantString.freeDaysAllowed)
    }

    private _getNumber = async (id: string) => {
        return this._get<number>(id);
    }

    // private _getString = async (id: string) => {
    //     return this._get<string>(id);
    // }

    private _getListNumber = async (id: string) => {
        return this._get<number[]>(id);
    }

    private _getAny = async (id: string) => {
        return this._get<any>(id);
    }

    // private _getListString = async (id: string) => {
    //     return this._get<string[]>(id);
    // }

    private _get = async <T>(id: string) => {
        return <T>await this._constantMongo.getOne(id);
    }

}

export default constantService;