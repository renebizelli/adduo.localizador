import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import serviceFactory from "../services/service.factory";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import httpStatusHelper from "../helpers/http-status.helper";
import { historyTypeEnum } from "../enum/history.enum";

class fenceController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.fence);
    }

    setRouter(router: express.Router): void {
        router.post(this.createRestrictedEndpoint('fence'), this.create);
        router.put(this.createRestrictedEndpoint('fence/:fenceId'), this.update);
        router.delete(this.createRestrictedEndpoint('fence/:fenceId'), this.delete);
        router.get(this.createRestrictedEndpoint('fence/:fenceId'), this.one);
        router.get(this.createRestrictedEndpoint('fences'), this.many);
        router.post(this.createPrivateEndpoint('fence/checkinside'), this.checkinside);
    }

    private create = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            await this.isActiveSubscription(req.context);

            let _fenceService = serviceFactory.fence(req.context);

            let fenceDto = requestToDtoParser.fence(req);

            let dto = await _fenceService.create(fenceDto);

            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'fence.controller.create()');
        }
    }


    private update = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _fenceService = serviceFactory.fence(req.context);

            let fenceDto = requestToDtoParser.fence(req);

            await _fenceService.update(fenceDto);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.fenceId, error, 'fence.controller.create()');
        }
    }

    private delete = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _fenceService = serviceFactory.fence(req.context);

            await _fenceService.delete(req.params.fenceId);

            httpStatusHelper.sendOk(res);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.fenceId, error, 'fence.controller.create()');
        }
    }

    private one = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _fenceService = serviceFactory.fence(req.context);

            let dto = await _fenceService.one(req.params.fenceId);

            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.fenceId, error, 'fence.controller.create()');
        }
    }

    private many = async (req: express.Request, res: express.Response) => {

        try {

            await this.isActiveSubscription(req.context);

            let _fenceService = serviceFactory.fence(req.context);

            let dtos = await _fenceService.all();

            httpStatusHelper.sendOk(res, dtos);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'fence.controller.create()');
        }
    }

    private checkinside = async (req: express.Request, res: express.Response) => {

        try {

            let _fenceService = serviceFactory.fenceCheckStatus(req.context);

            let dto: any = await _fenceService.check(req.body.deviceId);

            httpStatusHelper.sendOk(res, dto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'fence.controller.checkinside()');
        }
    }


}

export default fenceController;