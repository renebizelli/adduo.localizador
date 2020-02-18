import express = require("express");

import errorDto from "../dto/error.dto";

import httpStatusHelper from "../helpers/http-status.helper";

import logMongo from "../mongo/log.mongo";
import { historyTypeEnum } from "../enum/history.enum";

class logService {

    static logErrorAndSend = (req: express.Request, res: express.Response, type: historyTypeEnum, idType: string, error: errorDto, _function: string) => {

        if (error.custom) {
            httpStatusHelper.sendError(req, res, error);
        } else {

            logService.logError(
                type,
                idType,
                error,
                req,
                _function);

            httpStatusHelper.sendInternalError(req, res, '', error.message);
        }
    }

    static logError = (type: historyTypeEnum, idType: string, error: errorDto, req: express.Request, _function: string) => {

        (new logMongo).save(type,
            idType,
            error,
            req.context && req.context.uid,
            req.body,
            req.params,
            req.headers,
            req.url,
            req.method,
            _function)
            .then(() => { });

    }

    static logServiceError = (type: historyTypeEnum, idType: string, error: errorDto, uid: string, _function: string) => {

        (new logMongo).save(type,
            idType,
            error,
            uid,
            '',
            '',
            '',
            '',
            '',
            _function)
            .then(() => { });

    }
}

export default logService;