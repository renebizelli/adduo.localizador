import * as express from 'express';

import baseController from "./base.controller";

import httpStatus from '../helpers/http-status.helper';

import controlerInterface from '../interfaces/controller.interface';

import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import requestToDtoParser from '../parsers/request-to-dto.parser';
import { historyTypeEnum } from '../enum/history.enum';

class sessionController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.session);
    }

    setRouter(router: express.Router): void {
        router.post(this.createPublicEndpoint('sessions'), this.authentication);
        router.post(this.createRestrictedEndpoint('session/setup'), this.setup);
        router.post(this.createRestrictedEndpoint('session/resetpassword'), this.resetPassword);
        router.post(this.createPublicEndpoint('session/resetlostpassword'), this.lostPassword);
        router.put(this.createRestrictedEndpoint('session/logout'), this.logout);
        router.post(this.createPublicEndpoint('session/validatecode'), this.validateCodeToResetPassword);
        router.put(this.createPublicEndpoint('session/changepassword'), this.changePassword);
    }

    authentication = async (req: express.Request, res: express.Response) => {

        try {

            let email = req.body.email;
            let password = req.body.password;

            let _sessionService = serviceFactory.session(req.context);

            let auth = await _sessionService.authentication(email, password);

            httpStatus.sendOk(res, auth);
        }
        catch (error) {
            httpStatusHelper.sendError(req, res, error)
        }
    }

    setup = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            let setupDto = requestToDtoParser.setup(req);

            setupDto = await _sessionService.setup(setupDto);

            httpStatusHelper.sendOk(res, setupDto);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'session.controller.sendPasswordResetEmail()')
        }

    }

    lostPassword = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            await _sessionService.sendPasswordResetEmail(req.body.email);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {

            this.logErrorAndSend(req, res, req.body.email, error, 'session.controller.lostPassword()')
        }

    }

    resetPassword = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            await _sessionService.sendPasswordResetEmail(req.context.email);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {

            this.logErrorAndSend(req, res, req.body.email, error, 'session.controller.resetPassword()')
        }

    }

    logout = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            await _sessionService.logout();

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, req.context.uid, error, 'session.controller.logout()')
        }

    }

    validateCodeToResetPassword = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            let dto = requestToDtoParser.sessionValidateCode(req);

            await _sessionService.validateCode(dto);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'session.controller.logout()')
        }

    }

    changePassword = async (req: express.Request, res: express.Response) => {

        try {

            let _sessionService = serviceFactory.session(req.context);

            let dto = requestToDtoParser.changePassword(req);

            await _sessionService.changePassword(dto);

            httpStatusHelper.sendOk(res);

        }
        catch (error) {
            this.logErrorAndSend(req, res, '0', error, 'session.controller.changePassword()')
        }

    }


}

export default sessionController;