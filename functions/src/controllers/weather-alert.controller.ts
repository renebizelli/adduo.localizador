import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import serviceFactory from "../services/service.factory";
import httpStatusHelper from "../helpers/http-status.helper";
import { historyTypeEnum } from "../enum/history.enum";

class weatherAlertController extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.weather);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPrivateEndpoint('weather-alert'), this.load);
        router.get(this.createRestrictedEndpoint('weather-alert/checkinside/:deviceId'), this.checkinside);
    }

    private load = async (req: express.Request, res: express.Response) => {

        try {

            let _weatherAlertService = serviceFactory.weatherAlert();

            await _weatherAlertService.load();

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'weather-alert.controller.load()')
        }

    }

    private checkinside = async (req: express.Request, res: express.Response) => {

        try {

            let _weatherAlertService = serviceFactory.weatherAlertCheck(req.context);

            await _weatherAlertService.check(req.params.deviceId);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'weather-alert.controller.checkinside()')
        }
    }

}

export default weatherAlertController;