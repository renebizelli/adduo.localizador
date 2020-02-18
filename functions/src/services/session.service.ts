import express = require("express");

import baseService from "./base.service";

import requestContextDto from "../dto/request-context.dto";

import * as cultureEnum from "../enum/culture.enum";

import timeStampHelper from "../helpers/timestamp.helper";
import firebaseHelper from '../helpers/firebase.helper';
import validatorHelper from "../helpers/validator.helper";
import httpStatusHelper from "../helpers/http-status.helper";

import firebaseFactory from "../firebase/firebase.factory";
import serviceFactory from "./service.factory";
import setupDto from "../dto/setup.dto";
import { changingTypesString } from "../enum/changing.enum";
import { cultureString } from "../enum/culture.enum";
import mongoFactory from "../mongo/mongo.factory";
import sessionPasswordCodeDto from "../dto/session-password-code.dto";
import platformEnum from "../enum/platform.enum";
import { actionEnum } from "../enum/action.enum";
import { historyTypeEnum } from "../enum/history.enum";

class sessionService
    extends baseService {

    private _sessionFirebase = firebaseFactory.session();
    private _userMongo = mongoFactory.user();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.session);
    }

    setRequestContext = async (req: express.Request) => {

        let headerLanguage = req.headers['accept-language'];
        let culture = cultureEnum.default.cultureString();

        if (headerLanguage && cultureEnum.default.contains(headerLanguage.toString())) {
            culture = headerLanguage.toString();
        }

        req.context = new requestContextDto();

        if (req.headers['ts']) {
            req.context.ts = req.headers['ts']!.toString();
        }

        req.context.culture = <cultureString>culture;
    }

    authProcess = async (req: express.Request) => {

        if(!req.headers['authorization'])
        {
            throw httpStatusHelper.unauthorized('error:auth.token');
        }

        let token = req.headers['authorization'].toString();

        let decodedToken = await this._sessionFirebase.verifyIdToken(token);

        req.context.uid = decodedToken.uid;
        req.context.name = decodedToken.name;
        req.context.email = decodedToken.email;
    }

    preventSimultaneousAuth = async (req: express.Request) => {

        let _userService = serviceFactory.user(req.context);

        let ts = req.context.ts;

        let valid = validatorHelper.notNullOrEmpty(ts);

        if (valid && ts.toLowerCase() != 'auth') {

            let user = await _userService.sessionByAuth();

            if (user) {
                valid = validatorHelper.notNullOrEmpty(user.session) &&
                    validatorHelper.notNullOrEmpty(user.session.last_signin) &&
                    user.session.last_signin <= parseFloat(ts)
            }
        }

        if (!valid) {

            await this.history(actionEnum.conflit);

            throw httpStatusHelper.locked();
        }

    }

    authentication = async (email: string, password: string) => {

        try {

            let signin = await this._sessionFirebase.authentication(email, password);
            signin.session!.ts = timeStampHelper.get();
            return signin;
        }
        catch (error) {
            throw firebaseHelper.parserErrorToHttpStatus(error);
        }

    }

    sendPasswordResetEmail = async (email: string) => {

        this._validateResetPassword(email);

        await this._sessionFirebase.sendPasswordResetEmail(email);

        await this.history(actionEnum.reset, this._context.uid || email, { email: email });
    }

    setup = async (_setup: setupDto) => {

        this._validateSetup(_setup);

        let _userService = serviceFactory.user(this._context);
        await _userService.setup(_setup);

        let _locationService = serviceFactory.location(this._context);
        await _locationService.setup(_setup);

        await _userService.changing(changingTypesString.currentSmartphone, _setup.deviceId);

        await this.history(actionEnum.setup, this._context.uid, _setup);

        return _setup;
    }

    logout = async () => {
        await this._userMongo.logout(this._context.uid);
        await this.history(actionEnum.logout);
    }

    validateCode = async (dto: sessionPasswordCodeDto) => {
        return this._sessionFirebase.validateCode(dto);
    }

    changePassword = async (dto: sessionPasswordCodeDto) => {
        this._validateChangePassword(dto);
        await this._sessionFirebase.changePassword(dto);
        await this.history(actionEnum.update, "0", { password: "0" });
    }

    private _validateChangePassword(dto: sessionPasswordCodeDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(dto.password, 'error:user.form.password');
        validatorHelper.throwBadRequestIfTrue(dto.confirmPassword != dto.password, 'error:user.form.confirm-password');
    }

    private _validateResetPassword(email: string) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(email, 'error:user.form.email');
    }

    private _validateSetup(_setup: setupDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(_setup.deviceId, 'error:auth.setup.deviceId');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(_setup.platform, 'error:generic.platform');
        validatorHelper.throwBadRequestIfTrue(!platformEnum.containPlatform(_setup.platform), 'error:device.smartphone.form.platform')
    }


}

export default sessionService;    
