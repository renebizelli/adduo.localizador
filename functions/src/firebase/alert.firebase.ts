import * as firebaseAdmin from 'firebase-admin';
import baseFirebase from './base.firebase';

import notificationQueueDto from '../dto/notification-queue.dto';
import notificationParser from '../parsers/notification.parse';

class alertFirebase extends baseFirebase {

    create = async (queueDtos: notificationQueueDto[]) => {

        let alertDtos = notificationParser.toAlert(queueDtos);

        for (let alertDto of alertDtos) {
            await firebaseAdmin
                .database()
                .ref('alerts')
                .child(alertDto.uid)
                .push(alertDto);
        }
    }

}

export default alertFirebase;