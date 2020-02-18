import serviceFactory from "./service.factory";
import notificationQueueDto from "../dto/notification-queue.dto";
import requestContextDto from "../dto/request-context.dto";
import baseService from "./base.service";
import { historyTypeEnum } from "../enum/history.enum";

class notificationManager extends baseService {

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.notification);
    }

    send = async (queueDtos: notificationQueueDto[], push: boolean = true, alert: boolean = true) => {

        try {

            let _pushService = serviceFactory.push(this._context);
            let _alertService = serviceFactory.alert(this._context);

            if (push) {
                await _pushService.queue(queueDtos);
            }

            if (alert) {
                await _alertService.create(queueDtos);
            }
        }
        catch (error) {
            this.log('0', error, 'notification.manager.send()');
        }
    }
}

export default notificationManager;