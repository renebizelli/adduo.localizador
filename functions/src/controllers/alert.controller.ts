
import express = require('express');
import baseController from './base.controller';
import controlerInterface from '../interfaces/controller.interface';
import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import requestToDtoParser from '../parsers/request-to-dto.parser';
import { historyTypeEnum } from '../enum/history.enum';

class alertController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.alert);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPrivateEndpoint('alert'), this.create);
    }

    private create = async (req: express.Request, res: express.Response) => {

        try {

            let _alertService = serviceFactory.alert(req.context);

            let queueDto = requestToDtoParser.notificationQueue(req);

            let queueDtos = [queueDto];

            await _alertService.create(queueDtos);

            httpStatusHelper.sendOk(res, queueDtos);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'alert.controller.create()');
        }
    }


}

export default alertController;