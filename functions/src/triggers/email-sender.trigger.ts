import * as functions from 'firebase-functions';
import logService from '../services/log.service';
import serviceFactory from '../services/service.factory';
import { historyTypeEnum } from '../enum/history.enum';
import emailQueueDto from '../dto/email.queue.dto';

export const onCreate = functions.database.ref('/emails/{key}')
    .onWrite(async (snapshot, context) => {

        try {

            let queueDto = <emailQueueDto>snapshot.after.val();

            queueDto.key = context.params.key;

            let emailService = serviceFactory.email();

            await emailService.send(queueDto);

        } catch (error) {
            logService.logServiceError(historyTypeEnum.email, '0', error, '', 'email-trigger.onCreate()');
        } finally {
            return true;
        }

    });