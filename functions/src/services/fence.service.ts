import baseService from './base.service';
import requestContextDto from '../dto/request-context.dto';
import fenceDto from '../dto/fence.dto';
import mongoFactory from '../mongo/mongo.factory';
import validatorHelper from '../helpers/validator.helper';
import httpStatusHelper from '../helpers/http-status.helper';
import fenceEnum from '../enum/fence.enum';
import { historyTypeEnum } from '../enum/history.enum';
import { actionEnum } from '../enum/action.enum';

class fenceService
    extends baseService {

    private _fenceMongo = mongoFactory.fence();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.fence);
    }

    create = async (fenceDto: fenceDto) => {

        this._validateCreate(fenceDto);

        let dto = await this._fenceMongo.create(fenceDto);

        await this.history(actionEnum.create, dto._id, fenceDto);

        return dto;
    }

    update = async (fenceDto: fenceDto) => {

        this._validateCreate(fenceDto);

        let result = await this._fenceMongo.update(fenceDto);

        if (validatorHelper.isNullOrEmpty(result)) {
            throw httpStatusHelper.notFound();
        }

        await this.history(actionEnum.update, fenceDto._id, fenceDto);

        return;
    }

    private _validateCreate(dto: fenceDto) {

        let key = 'error:fence.form.'
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.title, key + 'title');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.address, key + 'address');
        validatorHelper.throwBadRequestIfTrue(fenceEnum.notContainPriority(dto.priority), key + 'priority');
        validatorHelper.throwBadRequestIfZeroNullOrEmpty(dto.radius, key + 'radius');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.title, key + 'title');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.userUid, key + 'uid');
        validatorHelper.throwBadRequestIfInvalidGeoPoint(dto, key + 'location');
    }

    delete = async (fenceId: string) => {
        await this._fenceMongo.delete(fenceId, this._context.uid);
        this.history(actionEnum.delete, fenceId);
    }

    one = async (fenceId: string) => {

        let dto = await this._fenceMongo.one(fenceId, this._context.uid);

        if (dto) {
            return dto;
        }
        else {
            throw httpStatusHelper.notFound('error:fence.not-found');
        }
    }

    all = async () => {
        return this._fenceMongo.all(this._context.uid);
    }

    removeUser = async (monitoredUid: string) => {
        return this._fenceMongo.removeUser(this._context.uid, monitoredUid);
    }

}

export default fenceService;