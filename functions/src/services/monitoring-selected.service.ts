import baseService from "./base.service";
import requestContextDto from "../dto/request-context.dto";
import mongoFactory from "../mongo/mongo.factory";
import { historyTypeEnum } from "../enum/history.enum";
import monitoringSelectedDto from "../dto/monitoring-selected.dto";
import timeStampHelper from "../helpers/timestamp.helper";
import validatorHelper from "../helpers/validator.helper";
import { actionEnum } from "../enum/action.enum";
import { timestampPart } from "../enum/timestamp.enum";
import { productEnumString } from "../enum/product.enum";

class monitoringSelectedService extends baseService {

    private _monitoringMongo = mongoFactory.monitoringSelected();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.selected);
    }

    save = async (monitorableUid: string) => {

        this._validate(monitorableUid);

        await this._checkSelectedQuantity();

        let ts = timeStampHelper.get();
        let lockedDays = <number>global.config.monitoring["selected-locked-up-to-days"];
        let lockedUpTo = timeStampHelper.addDays(ts, lockedDays);

        let dto = <monitoringSelectedDto>{
            monitorableUid: monitorableUid,
            allowedUid: this._context.uid,
            selectedAt: ts,
            lockedUpTo: lockedUpTo
        }

        await this._monitoringMongo.save(dto);

        this.history(actionEnum.save, monitorableUid, { lockedUpTo: lockedUpTo })
    }

    private _checkSelectedQuantity = async () => {

        let checkSelectedQuantity = await this._monitoringMongo.checkSelectedQuantity(this._context.uid);

        var isSelectedExceeded = checkSelectedQuantity.sku != productEnumString.free &&
            checkSelectedQuantity.numberOfLicenses <= checkSelectedQuantity.usedLicenses;

        validatorHelper.throwBadRequestIfTrue(isSelectedExceeded, 'error:monitoring.selected-save-exceeded');
    }

    private _validate(monitorableUid: string) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(monitorableUid, 'error:generic.monitorable-uid');
    }

    selectedToMapMany = async () => {

        let selected = await this._monitoringMongo.toMapMany(this._context.uid);

        return selected;
    }


    selectedToAccountMany = async () => {

        let selected = await this._monitoringMongo.toAccountMany(this._context.uid);

        for (let s of selected) {
            let daysLeft = timeStampHelper.diffNow(s.lockedUpTo, timestampPart.days)
            s.canBeChanged = daysLeft >= 0;
            s.daysLeft = Math.abs(daysLeft);
        }

        return selected;
    }


    delete = async (monitorableUid: string) => {

        this._validate(monitorableUid);

        let dto = <monitoringSelectedDto>{
            monitorableUid: monitorableUid,
            allowedUid: this._context.uid
        }

        await this._monitoringMongo.delete(dto);

        this.history(actionEnum.delete, monitorableUid)
    }
}

export default monitoringSelectedService;