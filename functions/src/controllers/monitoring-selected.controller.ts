import * as express from 'express';

import controlerInterface from "../interfaces/controller.interface";

import baseController from "./base.controller";
import serviceFactory from '../services/service.factory';
import httpStatusHelper from '../helpers/http-status.helper';
import { historyTypeEnum } from '../enum/history.enum';

class monitoringSelectedController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.selected);
    }

    setRouter(router: express.Router): void {
        router.put(this.createRestrictedEndpoint('monitoring/selected/:monitorableUid'), this.save);
        router.get(this.createRestrictedEndpoint('monitoring/selected-to-map'), this.selectedToMap);
        router.get(this.createRestrictedEndpoint('monitoring/selected'), this.selectedToMap);
        router.get(this.createRestrictedEndpoint('monitoring/selected-to-account'), this.selectedToAccount);
        router.delete(this.createRestrictedEndpoint('monitoring/selected/:selectedUid'), this.delete);
    }


    private save = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringSelected(req.context);

            await _monitoringService.save(req.params.monitorableUid);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.monitorableUid, error, 'monitoring-selected.controller.save()')
        }

    }

    private selectedToMap = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringSelected(req.context);

            let selected = await _monitoringService.selectedToMapMany();

            httpStatusHelper.sendOk(res, selected);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'monitoring-selected.controller.many()')
        }

    }

    private selectedToAccount = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringSelected(req.context);

            let selected = await _monitoringService.selectedToAccountMany();

            httpStatusHelper.sendOk(res, selected);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'monitoring-selected.controller.many()')
        }

    }


    private delete = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringSelected(req.context);

            await _monitoringService.delete(req.params.selectedUid);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.selectedUid, error, 'monitoring-selected.controller.delete()')
        }

    }

}

export default monitoringSelectedController


