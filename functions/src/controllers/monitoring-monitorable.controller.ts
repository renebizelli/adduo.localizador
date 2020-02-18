import * as express from 'express';

import controlerInterface from "../interfaces/controller.interface";

import baseController from "./base.controller";
import serviceFactory from '../services/service.factory';
import requestToDtoParser from '../parsers/request-to-dto.parser';
import httpStatusHelper from '../helpers/http-status.helper';
import { historyTypeEnum } from '../enum/history.enum';

class monitoringMonitorableController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.monitorable);
    }

    setRouter(router: express.Router): void {
        router.put(this.createRestrictedEndpoint('monitoring/monitorable/:monitorableUid'), this.update);
        router.get(this.createRestrictedEndpoint('monitoring/unselected'), this.unselectedMany);
        router.delete(this.createRestrictedEndpoint('monitoring/monitorable/:monitorableUid'), this.delete);
    }

    private update = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let dto = requestToDtoParser.monitoringMonitorable(req);

            let _monitoringService = serviceFactory.monitoringMonitorable(req.context);

            await _monitoringService.update(dto);

            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.monitorableUid, error, 'monitoring-monitorable.controller.update()')
        }

    }

    private unselectedMany = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringMonitorable(req.context);

            let monitorable = await _monitoringService.unselectedMany();

            httpStatusHelper.sendOk(res, monitorable);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'monitoring-monitorable.controller.selected()')
        }

    }


    private delete = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _monitoringService = serviceFactory.monitoringMonitorable(req.context);

            await _monitoringService.delete(req.params.monitorableUid);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.monitorableUid, error, 'monitoring-monitorable.controller.delete()')
        }

    }

}

export default monitoringMonitorableController


