import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import httpStatusHelper from "../helpers/http-status.helper";
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import { historyTypeEnum } from "../enum/history.enum";

class subscriptionReceiptController
    extends baseController
    implements controlerInterface {


    constructor() {
        super(historyTypeEnum.receipt);
    }

    setRouter(router: express.Router): void {
        router.post(this.createRestrictedEndpoint('subscription/receipt/:transactionId'), this.add);
        router.post(this.createRestrictedEndpoint('subscription/receipt/send-to-admin/:transactionId'), this.sendToAdmin);
    }

    private add = async (req: express.Request, res: express.Response) => {

        let transactionId = '';

        try {

            let subscriptionService = serviceFactory.subscriptionReceipt(req.context);

            let receiptDto = requestToDtoParser.receipt(req);
            transactionId = receiptDto.transactionId

            await subscriptionService.add(receiptDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, transactionId, error, 'subscription-receipt.controller.receipt()')
        }

    }

    private sendToAdmin = async (req: express.Request, res: express.Response) => {

        try {

            let subscriptionService = serviceFactory.subscriptionReceipt(req.context);

            await subscriptionService.sendToAdmin(req.params.transactionId);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.transactionId, error, 'subscription-receipt.controller.sendToAdmin()')
        }
    }





}

export default subscriptionReceiptController;