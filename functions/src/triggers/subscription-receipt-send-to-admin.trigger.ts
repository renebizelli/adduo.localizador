import * as functions from 'firebase-functions';
import logService from '../services/log.service';
import serviceFactory from '../services/service.factory';
import generateRequestContextMongo from '../mongo/generate-request-context.mongo';
import { historyTypeEnum } from '../enum/history.enum';

export const onUpdate = functions.database.ref('/users/{uid}/changing/receipt')
    .onUpdate(async (snapshot, context) => {

        let uid = context.params.uid;
        let transactionId = snapshot.after.val();

        try {

              if (transactionId && transactionId != '0') {
                let requestContextDto = await generateRequestContextMongo.byUid(uid);
                let subscriptionReceipt = serviceFactory.subscriptionReceipt(requestContextDto);
                await subscriptionReceipt.sendToAdmin(transactionId);
            }

        } catch (error) {
            logService.logServiceError(historyTypeEnum.receipt, transactionId, error, context.params.uid, 'subscription-receiptsend-admin-trigger.onUpdate()');
        } finally {
            return true;
        }

    });

