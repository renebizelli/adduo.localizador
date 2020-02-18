import baseService from './base.service';
import locationDto from '../dto/location.dto';
import validatorHelper from '../helpers/validator.helper';
import mongoFactory from '../mongo/mongo.factory';
import fenceCheckResultDto from '../dto/fence-check-result.dto';
import timeStampHelper from '../helpers/timestamp.helper';
import { timestampPart } from '../enum/timestamp.enum';
import { fenceStatusString } from '../enum/fence.enum';
import fenceCheckDto from '../dto/fence-check.dto';
import locale from '../locales/locale';
import '../prototypes/string.prototype';
import notificationParser from '../parsers/notification.parse';
import serviceFactory from './service.factory';
import dtoToDtoParser from '../parsers/dto-to-dto.parser';
import firebaseFactory from '../firebase/firebase.factory';
import requestContextDto from '../dto/request-context.dto';

class fenceCheckService extends baseService {

    constructor(_context: requestContextDto) {
        super(_context);
    }

    private _fenceCheckMongo = mongoFactory.fenceCheck();
    private _locationHistory = mongoFactory.locationHistory();
    private _locationFirebase = firebaseFactory.location();

    check = async (deviceId: string): Promise<any> => {

        let locationDto = await this._locationFirebase.one(deviceId);
        locationDto.deviceId = deviceId;

        this._validateCheck(locationDto)

        let fenceCheckResultDto = await this._fenceCheckMongo.check(locationDto);

        await this._processFences(fenceCheckResultDto, locationDto);

        return fenceCheckResultDto;
    }

    private _validateCheck(locationDto: locationDto): void {
        validatorHelper.throwBadRequestIfInvalidGeoPoint(locationDto, 'error:generic.position');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(locationDto.deviceId, 'error:generic.device');
    }

    private _canProcess(fence: fenceCheckResultDto): boolean {

        let ts = timeStampHelper.get();
        let diffLastEvent = timeStampHelper.diff(ts, fence.monitored.updatedAt, timestampPart.minutes);

        let canBeProcess = diffLastEvent >= parseFloat(global.config.fence.minutesForNextProcess);

        return canBeProcess;
    }

    private _newStatus(fence: fenceCheckResultDto, locationDto: locationDto): fenceStatusString {

        let virtualFence = fence.radius + (locationDto.accuracy * parseFloat(global.config.fence.marginOfError));

        let newStatus = fenceStatusString.none;

        if (fence.distance <= virtualFence) {
            newStatus = fenceStatusString.inside;
        } else if (fence.distance <= virtualFence + parseFloat(global.config.fence.proximity)) {
            newStatus = fenceStatusString.near;
        } else {
            newStatus = fenceStatusString.outside;
        }

        return newStatus;
    }

    private _notification = async (dto: fenceCheckDto) => {

        let title = locale.get('text:fence.status.title', dto.culture);
        //title = debugHelper.addEnvAbrev(title);

        let body = locale.get('text:fence.status.body.{0}'.stringFormat([dto.status]), dto.culture);
        body = body.naming(dto.alias);
        body = body.stringFormat([dto.title]);

        let queueDto = notificationParser.fence([dto.uid], title, body, dto.occurredAt, dto.priority, dto.monitorableUid, dto.fenceId);

        let notificationManager = serviceFactory.notification(this._context);

        await notificationManager.send(queueDto);
    }

    private _processFences = async (fences: fenceCheckResultDto[], locationDto: locationDto) => {

        for (let fence of fences) {

            let canBeProcess = this._canProcess(fence);

            if (canBeProcess) {

                let newStatus = this._newStatus(fence, locationDto);

                /* 
                    Notifica se for inside, ouside e ee for near sendo o status anterior outside.
                    Essa regra evita que haja notificação quando o usuário ir de inside para near.
                */
                if (fence && fence.monitored && newStatus != fence.monitored.status &&
                    newStatus != fenceStatusString.none) {

                    let fenceCheckDto = dtoToDtoParser.toFenceCheck(locationDto, fence, newStatus);

                    if ((newStatus != fenceStatusString.near) ||
                        (fence.monitored.status == fenceStatusString.outside)) {

                        await this._notification(fenceCheckDto);

                        await this._locationHistory.addFence(fenceCheckDto);
                    }

                    await this._fenceCheckMongo.monitoredStatusUpdate(fenceCheckDto);
                }
            }
        }
    }
}

export default fenceCheckService;