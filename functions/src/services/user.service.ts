import express = require("express");

import { actionEnum } from "../enum/action.enum";
import { changingTypesString } from "../enum/changing.enum";
import cultureEnum, { cultureString } from "../enum/culture.enum";

import baseService from "./base.service";

import stringHelper from "../helpers/string.helper";
import validatorHelper from "../helpers/validator.helper";

import requestContextDto from "../dto/request-context.dto";

import firebaseFactory from "../firebase/firebase.factory";
import mongoFactory from "../mongo/mongo.factory";
import setupDto from "../dto/setup.dto";
import userDto from "../dto/user.dto";
import userRefreshTokenDto from "../dto/user-refresh-token.dto";
import firebaseToDto from "../parsers/firebase-to-dto.parser";
import serviceFactory from "./service.factory";
import { historyTypeEnum } from "../enum/history.enum";

class userService
    extends baseService {

    private _userFirebase = firebaseFactory.user();
    private _userMongo = mongoFactory.user();
    private _storageFirebase = firebaseFactory.storage();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.user);
    }

    create = async (userDto: userDto) => {

        this._validate(userDto, actionEnum.create);

        let userRecord = await this._userFirebase.create(userDto);

        let user = firebaseToDto.userRecordToUser(userRecord);

        await this.historyByUid(user.uid, actionEnum.create, user.uid, user);

        return userRecord;
    }

    update = async (userDto: userDto) => {

        this._validate(userDto, actionEnum.update);

        await this._userFirebase.update(userDto);
        await this._userMongo.update(this._context.uid, userDto);

        await this.history(actionEnum.update, userDto.uid, userDto);
    }

    complement = async () => {

        let exists = await this._userMongo.exist(this._context.uid);

        if (!exists) {
            let user = await this.get(this._context.uid);
            user.culture = this._context.culture;
            await this._userMongo.save(user);
            await this._userFirebase.init(user);
            await this.history(actionEnum.complement, user.uid, user);

            let subscriptionService = serviceFactory.subscription(this._context);
            await subscriptionService.addFreeSubscription(user);

            let emailService = serviceFactory.email();
            await emailService.registerQueue(user);
        }
    }

    get = async (uid: string) => {
        return this._userFirebase.get(uid);
    }

    private _validate(userDto: userDto, action: actionEnum): void {

        let key = 'error:user.form.';
        validatorHelper.throwBadRequestIfIsNullOrEmpty(userDto.name, key + 'name');
        validatorHelper.throwBadRequestIfInvalidEmail(userDto.email, key + 'email');

        if (userDto.phone) {
            validatorHelper.throwBadRequestIfInvalidPhone(userDto.phone, key + 'phone');
        }

        if (action === actionEnum.create) {
            validatorHelper.throwBadRequestIfPasswordInvalid(userDto.password || '', key + 'password');
        }

    }

    upload = async (photo: any, req: express.Request, uid: string) => {

        try {

            if (photo) {

                let base64 = stringHelper.base64Process(photo);

                let imageBuffer = Buffer.from(base64, 'base64');

                let file = this._storageFirebase.fileFactory(uid);

                await file.save(imageBuffer, {
                    metadata: {
                        contentType: 'image/jpeg'
                    },
                    public: true,
                    validation: 'md5'
                });

                await file.makePublic();

                await this.changing(changingTypesString.photo);

                await this.historyByUid(uid, actionEnum.upload);
            }
        }
        catch (error) {
            this.log(uid, error, 'user.service.upload()');
        }

    }

    sessionByAuth = async () => {
        return this.sessionByUid(this._context.uid);
    }

    sessionByUid = async (uid: string) => {
        return this._userMongo.sessionByUid(uid);
    }

    pushTokenOne = async () => {
        return this._userMongo.pushTokenOne(this._context.uid);
    }

    basicOne = async () => {
        return this._userMongo.basicOne(this._context.uid);
    }


    pushTokenOneByUid = async (uid: string) => {
        return this._userMongo.pushTokenOne(uid);
    }

    changing = async (type: changingTypesString, value?: string) => {
        return this._userFirebase.changing(this._context.uid, type, value);
    }

    changingForce = async (type: changingTypesString, value: string) => {
        await this.changing(type, '0');
        return this.changing(type, value);
    }

    photoDelete = async () => {
        await this._storageFirebase.photoDelete(this._context.uid);
        await this.changing(changingTypesString.photo);

        await this.history(actionEnum.delete, this._context.uid, { type: "photo" });
    }

    cultureUpdate = async (userDto: userDto) => {
        let culture = this._processCultureUpdate(userDto);
        await this._userMongo.cultureUpdate(userDto.uid, culture);

        await this.history(actionEnum.update, this._context.uid, { culture: userDto.culture });
    }

    setup = async (setup: setupDto) => {
        return this._userMongo.setup(setup);
    }

    refreshToken = async (tokenDto: userRefreshTokenDto) => {
        this._validateRefreshToken(tokenDto);
        await this._userMongo.refreshToken(tokenDto);
    }

    private _validateRefreshToken(tokenDto: userRefreshTokenDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(tokenDto.token, 'error:auth.token');

    }

    private _processCultureUpdate(userDto: userDto) {

        let culture = cultureEnum.culture();

        if (validatorHelper.includeIn(userDto.culture, cultureEnum.cultures())) {
            culture = <cultureString>userDto.culture;
        }

        return culture;
    }

}

export default userService;