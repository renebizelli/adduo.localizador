import * as express from 'express';

import controlerInterface from "../interfaces/controller.interface";

import baseController from "./base.controller";

import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import requestToDtoParser from '../parsers/request-to-dto.parser';
import { historyTypeEnum } from '../enum/history.enum';

class userController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.user);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPublicEndpoint('users'), this.create);
        router.put(this.createRestrictedEndpoint('users'), this.update);
        router.delete(this.createRestrictedEndpoint('users/photo'), this.photoDelete);
        router.put(this.createRestrictedEndpoint('users/culture'), this.cultureUpdate);
        router.post(this.createRestrictedEndpoint('users/complement'), this.complement);
    }

    private create = async (req: express.Request, res: express.Response) => {

        let email = ''

        try {

            let _userService = serviceFactory.user(req.context);

            let userDto = requestToDtoParser.user(req);
            email = userDto.email;

            let result = await _userService.create(userDto);

            await _userService.upload(req.body.photoBase64, req, result.uid);

            httpStatusHelper.sendOk(res, result);

        }
        catch (error) {
            this.logErrorAndSend(req, res, email, error, 'user.controller.create()')
        }

    }

    private update = async (req: express.Request, res: express.Response) => {

        try {

            let _userService = serviceFactory.user(req.context);

            let userDto = requestToDtoParser.user(req);

            await _userService.update(userDto);

            await _userService.upload(req.body.photoBase64, req, req.context.uid);

            httpStatusHelper.sendOk(res, userDto);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.update()')
        }

    }

    private photoDelete = async (req: express.Request, res: express.Response) => {

        try {

            let _userService = serviceFactory.user(req.context);

            await _userService.photoDelete();

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.photoDelete()')
        }

    }

    private cultureUpdate = async (req: express.Request, res: express.Response) => {

        try {

            let _userService = serviceFactory.user(req.context);

            let userDto = requestToDtoParser.user(req);

            await _userService.cultureUpdate(userDto);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.cultureUpdate()')
        }

    }

    private complement = async (req: express.Request, res: express.Response) => {

        try {

            let _userService = serviceFactory.user(req.context);

            await _userService.complement();

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'user.controller.complement()')
        }

    }


}

export default userController


