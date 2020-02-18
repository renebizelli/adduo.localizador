import * as functions from 'firebase-functions';
import logService from '../services/log.service';
import serviceFactory from '../services/service.factory';
import generateRequestContextMongo from '../mongo/generate-request-context.mongo';
import { historyTypeEnum } from '../enum/history.enum';

export const onUpdate = functions.database.ref('/devices/{deviceId}/location')
    .onUpdate(async (snapshot, context) => {

        let deviceId = context.params.deviceId;

        try {

            let _requestContext = await generateRequestContextMongo.byDeviceId(deviceId);

            let weatherAlertCheckService = serviceFactory.weatherAlertCheck(_requestContext);

            await weatherAlertCheckService.check(context.params.deviceId);

        } catch (error) {
            logService.logServiceError(historyTypeEnum.weather, deviceId, error, JSON.stringify(context.auth || {}), 'weather-alert-trigger.onUpdate()');
        } finally {
            return true;
        }

    });