import express = require("express");

import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import serviceFactory from "../services/service.factory";
import httpStatusHelper from "../helpers/http-status.helper";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import { historyTypeEnum } from "../enum/history.enum";

class locationController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.location);
    }

    setRouter(router: express.Router): void {
        router.put(this.createRestrictedEndpoint('location/:deviceId'), this.updateRestricted);
        router.put(this.createPrivateEndpoint('location/:deviceId'), this.updatePrivate);
    }

    private updateRestricted = async (req: express.Request, res: express.Response) => {

        try {

            let dto = requestToDtoParser.location(req);

            let _locationService = serviceFactory.locationType(req.context, dto);

            await _locationService.update(dto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'location.controller.updateRestricted()');
        }

    }

    private updatePrivate = async (req: express.Request, res: express.Response) => {

        try {

            let dto = requestToDtoParser.location(req);

            let _locationService = serviceFactory.locationType(req.context, dto);

            await _locationService.update(dto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'location.controller.updatePrivate()');
        }

    }

}

export default locationController