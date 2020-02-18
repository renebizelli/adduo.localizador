import * as functions from 'firebase-functions';
import locationService from '../services/location.service';
import logService from '../services/log.service';
import { historyTypeEnum } from '../enum/history.enum';

export const onUpdate = functions.database.ref('/users/{userUid}/changing/currentSmartphone')
    .onUpdate(async (snapshot, context) => {

        let deviceId = snapshot.before.val();

        try {

            await locationService.delete(deviceId);

        } catch (error) {
            logService.logServiceError(historyTypeEnum.location, deviceId, error, '', 'location-delete-trigger.onUpdate()');
        } finally {
            return true;
        }

    });