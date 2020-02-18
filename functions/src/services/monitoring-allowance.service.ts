import baseService from "./base.service";

import requestContextDto from "../dto/request-context.dto";

import mongoFactory from "../mongo/mongo.factory";
import validatorHelper from "../helpers/validator.helper";
import serviceFactory from "./service.factory";
import monitoringAllowanceDto from "../dto/monitoring-allowance.dto";
import dtoToDtoParser from "../parsers/dto-to-dto.parser";
import firebaseFactory from "../firebase/firebase.factory";
import notificationParser from "../parsers/notification.parse";
import locale from "../locales/locale";
import '../prototypes/string.prototype';
import timeStampHelper from "../helpers/timestamp.helper";
import { actionEnum } from "../enum/action.enum";
import { historyTypeEnum } from "../enum/history.enum";
import { productEnumString } from "../enum/product.enum";
import deviceDto from "../dto/device.dto";

class monitoringAllowanceService extends baseService {

    private _monitoringCodeMongo = mongoFactory.monitoringCode();
    private _monitoringAllowanceMongo = mongoFactory.monitoringAllowance();
    private _monitoringAllowanceFirebase = firebaseFactory.monitoringAllowance();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.monitoring);
    }

    optIn = async (code: string) => {

        this._validateOptIn(code);

        let allowanceDto = await this._processCode(code);

        let optInDto = null;

        if (allowanceDto) {
            optInDto = dtoToDtoParser.allowanceToOptIn(allowanceDto, this._context.culture);
        }

        return optInDto
    }

    accept = async (code: string) => {

        this._validateOptIn(code);

        let allowanceDto = await this._processCode(code);

        let result = null;

        if (allowanceDto) {

            let ts = timeStampHelper.get();

            await this._registerAccept(allowanceDto, ts);

            await this._notificationAccept(allowanceDto, ts)

            await this.history(actionEnum.accept, allowanceDto.uid, { code: allowanceDto.code });

            result = dtoToDtoParser.allowanceToAccept(allowanceDto);
        }

        return result;
    }

    addIot = async (deviceDto: deviceDto) => {
        return this._monitoringAllowanceMongo.addIot(deviceDto);
    }

    allowedMany = async () => {
        return this._monitoringAllowanceMongo.allowedMany(this._context.uid);
    }

    removeAllowance = async (monitorableUid: string, allowdeUid: string) => {
        return this._monitoringAllowanceFirebase.removeAllowance(monitorableUid, allowdeUid);
    }

    private async _notificationAccept(allowanceDto: monitoringAllowanceDto, ts: number) {

        let titleNotification = locale.get("text:accept.title", allowanceDto.culture);
        let bodyNotification = locale.get("text:accept.body", allowanceDto.culture);
        bodyNotification = bodyNotification.naming(this._context.name);

        let queueDtos = notificationParser.accept([allowanceDto.uid], titleNotification, bodyNotification, ts, this._context.uid);

        let notificationManager = serviceFactory.notification(this._context);

        await notificationManager.send(queueDtos, true, true);

    }

    private _validateOptIn(code: string) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(code, 'error:monitoring.request-code-is-required');
    }

    private async _processCode(code: string) {

        let codeFound = await this._findCode(code);

        // este if serve apenas para a IDE parar de dar erro, dizendo que o objeto codeFound pode ser nulo.
        if (codeFound) {
            this._validateIfOwner(codeFound);
            await this._verifyIfExistMonitoring(codeFound);
        }

        return codeFound;
    }

    private async _findCode(code: string) {

        let codeDto = await this._monitoringCodeMongo.ownerOne(code);

        validatorHelper.throwNotFoundIfNull(codeDto, 'error:monitoring.request-code-invalid');

        return codeDto;
    }

    private _validateIfOwner(codeDto: monitoringAllowanceDto) {
        validatorHelper.throwBadRequestIfTrue(codeDto.uid == this._context.uid, 'error:monitoring.request-accept-invalid');
    }

    private async _verifyIfExistMonitoring(codeDto: monitoringAllowanceDto) {

        let _monitorableService = serviceFactory.monitoringMonitorable(this._context);

        let monitorableExist = await _monitorableService.any(codeDto.uid, this._context.uid);

        validatorHelper.throwBadRequestWithArgs(monitorableExist, 'error:monitoring.request-accept-conflit', this._context.culture, [codeDto.name]);
    }

    private async _registerAccept(allowanceDto: monitoringAllowanceDto, ts: number) {

        allowanceDto.selected = allowanceDto.productId == productEnumString.free;

        await this._monitoringAllowanceMongo.addMonitorable(allowanceDto, this._context, ts);
        await this._monitoringAllowanceFirebase.addAllowance(this._context.uid, allowanceDto.uid, true);
    }

}

export default monitoringAllowanceService;