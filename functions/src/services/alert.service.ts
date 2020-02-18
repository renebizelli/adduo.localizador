import baseService from "./base.service";
import requestContextDto from "../dto/request-context.dto";
import notificationQueueDto from "../dto/notification-queue.dto";
import firebaseFactory from "../firebase/firebase.factory";

class alertService extends baseService {

    private alertFirebase = firebaseFactory.alert();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    create = async (queueDtos: notificationQueueDto[]) => {
        return this.alertFirebase.create(queueDtos)
    }


}

export default alertService;