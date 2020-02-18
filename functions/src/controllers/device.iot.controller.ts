import express = require("express");

import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";

import httpStatusHelper from "../helpers/http-status.helper";
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import { historyTypeEnum } from "../enum/history.enum";

class deviceIotController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.deviceIot);
    }

    setRouter(router: express.Router): void {
        router.post(this.createRestrictedEndpoint('device/iot'), this.create);
    }

    private create = async (req: express.Request, res: express.Response) => {

        try {
            let _deviceIotService = serviceFactory.deviceIot(req.context);

            let deviceIotDto = requestToDtoParser.deviceIot(req);

            let device = await _deviceIotService.create(deviceIotDto);

            httpStatusHelper.sendOk(res, device);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'device-iot.controller.create()');
        }

    }

}

export default deviceIotController;