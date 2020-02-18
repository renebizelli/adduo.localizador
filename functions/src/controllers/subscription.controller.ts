import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import httpStatusHelper from "../helpers/http-status.helper";
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import generateRequestContextMongo from "../mongo/generate-request-context.mongo";
import { historyTypeEnum } from "../enum/history.enum";

class subscriptionController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.subscription);
    }

    setRouter(router: express.Router): void {
        router.get(this.createPrivateEndpoint('subscription/process-overdue-users'), this.processOverdueUsers);
        router.get(this.createPrivateEndpoint('subscription/countdown-free-users'), this.countdownFreeUsers);
        router.put(this.createPrivateEndpoint('subscription/receipt/processed'), this.update);
        router.get(this.createRestrictedEndpoint('subscription'), this.one);
        router.put(this.createRestrictedEndpoint('subscription/free'), this.freeUpdate);

    }

    private freeUpdate = async (req: express.Request, res: express.Response) => {

        try {

            let _subscriptionService = serviceFactory.subscription(req.context);

            await _subscriptionService.freeUpdate();

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.freeUpdate()')
        }

    }

    private one = async (req: express.Request, res: express.Response) => {

        try {

            let _subscriptionService = serviceFactory.subscription(req.context);

            let status = await _subscriptionService.one();

            httpStatusHelper.sendOk(res, status);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.one()')
        }

    }

    private countdownFreeUsers = async (req: express.Request, res: express.Response) => {

        try {

            let userFreeService = serviceFactory.userFree();

            await userFreeService.countdownCommunication();

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'subscription.controller.countdownFreeUsers()')
        }

    }

    private processOverdueUsers = async (req: express.Request, res: express.Response) => {

        try {

            let userOverdueService = serviceFactory.userOverdue();

            await userOverdueService.processOverdueUsers();

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'subscription.controller.processFreeUsers()')
        }
    }

    private update = async (req: express.Request, res: express.Response) => {

        let transactionId = ''

        try {

            let processedReceiptDto = requestToDtoParser.bodyToSubscriptionUpdate(req);
            transactionId = processedReceiptDto.transactionId;

            let context = await generateRequestContextMongo.byUid(processedReceiptDto.uid);

            let subscriptionService = serviceFactory.subscription(context);

            await subscriptionService.toProcessSubscription(processedReceiptDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, transactionId, error, 'subscription.controller.processedReceipt()')
        }
    }


}

export default subscriptionController;


