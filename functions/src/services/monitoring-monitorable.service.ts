import requestContextDto from "../dto/request-context.dto";
import baseService from "./base.service";
import mongoFactory from "../mongo/mongo.factory";
import monitoringMonitorableDto from "../dto/monitoring-monitorable.dto";
import validatorHelper from "../helpers/validator.helper";
import serviceFactory from "./service.factory";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";


class monitoringMonitorableService extends baseService {

    private _monitoringMongo = mongoFactory.monitoringMonitorable();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.monitorable);
    }

    any = async (allowedUid: string, monitorableUid: string) => {
        let monitorable = await this._monitoringMongo.one(allowedUid, monitorableUid);
        return monitorable ? true : false; // para retornar booleano
    }

    one = async (allowedUid: string, monitorableUid: string) => {
        return this._monitoringMongo.one(allowedUid, monitorableUid);
    }

    unselectedMany = async () => {
        let monitorables = await this._monitoringMongo.unselectedMany(this._context.uid);
        return monitorables;
    }

    delete = async (monitorableUid: string) => {
        await this._monitoringMongo.delete(this._context.uid, monitorableUid);

        let fenceService = serviceFactory.fence(this._context);
        await fenceService.removeUser(monitorableUid);

        let monitoringAllowanceService = serviceFactory.monitoringAllowance(this._context);
        await monitoringAllowanceService.removeAllowance(monitorableUid, this._context.uid);

        await this.history(actionEnum.remove, monitorableUid);
    }

    update = async (monitorable: monitoringMonitorableDto) => {
        this._validateUpdate(monitorable);

        let result = await this._monitoringMongo.update(monitorable)

        validatorHelper.throwNotFoundIfNull(result.n === 0, 'error:generic.user-not-found')

        await this.history(actionEnum.update, monitorable.monitorableUid, monitorable);
    }

    private _validateUpdate(monitorable: monitoringMonitorableDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(monitorable.alias, 'error:monitoring.form.alias');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(monitorable.uid, 'error:monitoring.form.uid');
    }

}

export default monitoringMonitorableService;