import baseService from "./base.service";
import requestContextDto from "../dto/request-context.dto";
import notificationQueueDto from "../dto/notification-queue.dto";
import firebaseFactory from "../firebase/firebase.factory";
import serviceFactory from "./service.factory";
import notificationParser from "../parsers/notification.parse";

class pushService extends baseService {

    private pushFirebase = firebaseFactory.push();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    queue = async (queueDtos: notificationQueueDto[]) => {
        return this.pushFirebase.queue(queueDtos)
    }

    send = async (queueDto: notificationQueueDto) => {

        try {

            let push = await this._payloadFactory(queueDto);

            if (push) {
                await this.pushFirebase.send(push.payload);
            }

            if (queueDto.key) {
                await this.pushFirebase.delete(queueDto.key);
            }

        }
        catch (error) {
            queueDto.try = queueDto.try | 0;
            if (queueDto.try < 5) {
                queueDto.try = queueDto.try + 1;
                queueDto.error = error
                await this.pushFirebase.requeue(queueDto);
            }
            else {
                throw error
            }
        }

    }

    private _payloadFactory = async (queueDto: notificationQueueDto) => {

        let _userService = serviceFactory.user(this._context);

        let userToken = await _userService.pushTokenOneByUid(queueDto.uid);

        let push: any = null;

        if (userToken) {
            push = notificationParser.toPush(queueDto, userToken);
        }

        return push;
    }

}

export default pushService; 