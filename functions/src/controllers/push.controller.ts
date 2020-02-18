import express = require('express');
import baseController from './base.controller';
import controlerInterface from '../interfaces/controller.interface';
import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import requestToDtoParser from '../parsers/request-to-dto.parser';
import { historyTypeEnum } from '../enum/history.enum';

class pushController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.push);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPrivateEndpoint('push/queue'), this.queue);
        router.post(this.createPrivateEndpoint('push/send'), this.send);
        router.post(this.createRestrictedEndpoint('push/refreshtoken'), this.refreshToken);
    }

    private queue = async (req: express.Request, res: express.Response) => {

        try {

            let _pushService = serviceFactory.push(req.context);

            let queueDto = requestToDtoParser.notificationQueue(req);

            let queueDtos = [queueDto];

            await _pushService.queue(queueDtos);

            httpStatusHelper.sendOk(res, queueDtos);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'push.controller.queue()');
        }
    }

    private send = async (req: express.Request, res: express.Response) => {

        try {

            let _pushService = serviceFactory.push(req.context);

            let queueDto = requestToDtoParser.notificationQueue(req);

            await _pushService.send(queueDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'push.controller.send()');
        }
    }

    private refreshToken = async (req: express.Request, res: express.Response) => {

        try {

            let _userService = serviceFactory.user(req.context);

            let tokenDto = requestToDtoParser.refreshToken(req);

            await _userService.refreshToken(tokenDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'push.controller.send()');
        }
    }


}

export default pushController;