import * as functions from 'firebase-functions';
import logService from '../services/log.service';
import serviceFactory from '../services/service.factory';
import generateRequestContextMongo from '../mongo/generate-request-context.mongo';
import notificationQueueDto from '../dto/notification-queue.dto';
import { historyTypeEnum } from '../enum/history.enum';

export const onCreate = functions.database.ref('/pushes/{key}')
    .onWrite(async (snapshot, context) => {

        try {

            let queueDto = <notificationQueueDto>snapshot.after.val();

            queueDto.key = context.params.key;

            let requestContextDto = await generateRequestContextMongo.byUid(queueDto.uid);

            let pushService = serviceFactory.push(requestContextDto);

            await pushService.send(queueDto);

        } catch (error) {
            logService.logServiceError(historyTypeEnum.push, '0', error, '', 'push-trigger.onUpdate()');
        } finally {
            return true;
        }

    });