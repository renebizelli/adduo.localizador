import * as firebaseAdmin from 'firebase-admin';
import baseFirebase from './base.firebase';

import notificationQueueDto from '../dto/notification-queue.dto';

class pushFirebase extends baseFirebase {

    queue = async (queueDtos: notificationQueueDto[]) => {

        for (let queueDto of queueDtos) {

            await firebaseAdmin
                .database()
                .ref('pushes')
                .push(queueDto);
        }
    }

    requeue = async (queueDto: notificationQueueDto) => {
        await this.delete(queueDto.key);
        await this.queue([queueDto]);
    }


    send = async (push: any) => {

        return await firebaseAdmin
            .messaging()
            .send(push)
    }

    delete = async (key: string) => {

        return firebaseAdmin
            .database()
            .ref('pushes/' + key).set(null);

    }



}

export default pushFirebase;