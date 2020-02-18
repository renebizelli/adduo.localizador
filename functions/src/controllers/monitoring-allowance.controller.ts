import * as express from 'express';

import controlerInterface from "../interfaces/controller.interface";

import baseController from "./base.controller";
import serviceFactory from '../services/service.factory';
import httpStatusHelper from '../helpers/http-status.helper';
import { historyTypeEnum } from '../enum/history.enum';

class monitoringAllowanceController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.monitoring);
    }

    setRouter(router: express.Router): void {
        router.post(this.createRestrictedEndpoint('monitoring/accept'), this.accept);
        router.get(this.createRestrictedEndpoint('monitoring/optin/:code'), this.optin);
    }

    private accept = async (req: express.Request, res: express.Response) => {

        try {

            let _monitoringService = serviceFactory.monitoringAllowance(req.context);

            let acceptDto = await _monitoringService.accept(req.body.code);

            httpStatusHelper.sendOk(res, acceptDto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.code, error, 'monitoring-allowance.controller.optin()')
        }

    }

    private optin = async (req: express.Request, res: express.Response) => {

        try {

            let _monitoringService = serviceFactory.monitoringAllowance(req.context);

            let optInDto = await _monitoringService.optIn(req.params.code);

            httpStatusHelper.sendOk(res, optInDto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.code, error, 'monitoring-allowance.controller.optin()')
        }

    }



}

export default monitoringAllowanceController


