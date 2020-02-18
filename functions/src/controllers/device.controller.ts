import express = require("express");

import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";

import httpStatusHelper from "../helpers/http-status.helper";
import serviceFactory from "../services/service.factory";
import { historyTypeEnum } from "../enum/history.enum";

class deviceController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.device);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('device/:deviceId'), this.one);
        router.delete(this.createRestrictedEndpoint('device/:deviceId'), this.delete);
    }

    private delete = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _deviceSmartphoneService = serviceFactory.deviceSmartphone(req.context);

            await _deviceSmartphoneService.delete(req.params.deviceId);
            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.deviceId, error, 'device.controller.delete()');
        }

    }

    private one = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _deviceSmartphoneService = serviceFactory.deviceSmartphone(req.context);

            let dto = await _deviceSmartphoneService.one(req.params.deviceId);
            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.deviceId, error, 'device.controller.one()');
        }

    }

}

export default deviceController;