import * as functions from 'firebase-functions';
import logService from '../services/log.service';
import serviceFactory from '../services/service.factory';
import generateRequestContextMongo from '../mongo/generate-request-context.mongo';
import { historyTypeEnum } from '../enum/history.enum';

export const onUpdate = functions.database.ref('/devices/{deviceId}/location')
    .onUpdate(async (snapshot, context) => {

        try {

            let deviceId = context.params.deviceId;

            let _requestContext = await generateRequestContextMongo.byDeviceId(deviceId);

            let fenceCheckService = serviceFactory.fenceCheckStatus(_requestContext);

            await fenceCheckService.check(context.params.deviceId);

        } catch (error) {
            logService.logServiceError(historyTypeEnum.fenceCheck, '0', error, JSON.stringify(context.auth || {}), 'fence-trigger.onUpdate()');
        } finally {
            return true;
        }

    });