import { historyTypeEnum } from "../enum/history.enum";
import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import httpStatusHelper from "../helpers/http-status.helper";

class emailController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.email);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPrivateEndpoint('email/send'), this.send);
    }


    private send = async (req: express.Request, res: express.Response) => {

        try {

            let _emailService = serviceFactory.email();

            let dto = requestToDtoParser.email(req);

            await _emailService.send(dto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'email.controller.send()');
        }
    }

}

export default emailController;