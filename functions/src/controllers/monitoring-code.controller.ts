import * as express from 'express';

import controlerInterface from "../interfaces/controller.interface";

import baseController from "./base.controller";

import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import { historyTypeEnum } from '../enum/history.enum';

class monitoringCodeController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.requestcode);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('monitoring/code'), this.one);
        router.get(this.createRestrictedEndpoint('monitoring/refreshcode'), this.create);
    }

    private one = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringCode(req.context);
            let codeDto = await _monitoringService.one();
            httpStatusHelper.sendOk(res, codeDto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'monitoring.controller.create()')
        }

    }

    private create = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringCode(req.context);
            let code = await _monitoringService.create();
            httpStatusHelper.sendOk(res, code);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'monitoring.request-code.controller.create()')
        }

    }

}

export default monitoringCodeController


