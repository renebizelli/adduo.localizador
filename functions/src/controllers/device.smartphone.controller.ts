import express = require("express");

import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";

import httpStatusHelper from "../helpers/http-status.helper";
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import { historyTypeEnum } from "../enum/history.enum";

class deviceSmartphoneController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.deviceSmartphone);
    }

    setRouter(router: express.Router): void {
        router.post(this.createRestrictedEndpoint('device/smartphone'), this.create);
        router.put(this.createRestrictedEndpoint('device/smartphone/:deviceId'), this.update);
    }

    private create = async (req: express.Request, res: express.Response) => {

        try {
            
            let _deviceSmartphoneService = serviceFactory.deviceSmartphone(req.context);

            let deviceSmartphoneDto = requestToDtoParser.deviceSmartphone(req);

            let dto = await _deviceSmartphoneService.create(deviceSmartphoneDto);
            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'device-smartphone.controller.createSmartphone()');
        }

    }

    private update = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _deviceSmartphoneService = serviceFactory.deviceSmartphone(req.context);

            let deviceSmartphoneDto = requestToDtoParser.deviceSmartphone(req);

            await _deviceSmartphoneService.update(deviceSmartphoneDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'device-smartphone.controller.update()');
        }

    }


}

export default deviceSmartphoneController;