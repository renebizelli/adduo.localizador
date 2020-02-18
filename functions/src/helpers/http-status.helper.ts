import * as express from 'express'

import errorHelper from './error.helper';
import errorDto from "../dto/error.dto";
import config from '../config/config';
import { httpStatusCode } from '../enum/http-status.enum';
import locale from '../locales/locale';

class httpStatusHelper {

    static sendOk(res: express.Response, data?: any) {

        let e = config.env();
        let v = global.config.version;

        if (Array.isArray(data) && data.length) {
            data[0]['e'] = e;
            data[0]['v'] = v;
        }
        else if (typeof data === 'string') {
            let s = data;
            data = {};
            data['e'] = e;
            data['v'] = v;
            data['data'] = s;
        } else if (data) {
            data['e'] = e;
            data['v'] = v;
        } else {
            data = {
                e: e,
                v: v
            }
        }

        res.json(data);
    }

    static badRequest(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.badrequest, code, message);
    }

    static internalError(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.internalError, code, message);
    }

    static conflict(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.conflict, code, message);
    }

    static gone(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.gone, code, message);
    }

    static unauthorized(code?: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.unauthorized, code, message);
    }

    static paymentRequired(code?: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.paymentRequired, code, message);
    }


    static teaPot(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.teapot, code, message);
    }

    static notAcceptable(code: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.notAcceptable, code, message);
    }

    static locked(code?: string, message: string = ''): errorDto {
        return errorHelper.factory(httpStatusCode.locked, code, message);
    }

    static notFound(code?: string): errorDto {
        return errorHelper.factory(httpStatusCode.notFound, code);
    }

    static sendError(req: express.Request, res: express.Response, error: errorDto) {

        if (error.code && !error.message) {
            error.message = locale.get(error.code, req.context.culture);
        }

        error.error = true;

        return res.status(error.status).json(error);
    }

    static sendInternalError(req: express.Request, res: express.Response, code: string, message: string = '') {
        let error = this.internalError(code, message);
        this.sendError(req, res, error)
    }

    static ensureSuccessStatusCode = (error: any, response: any) => {
        return !error &&
            response.statusCode &&
            response.statusCode == httpStatusCode.ok;

    }

    static errorByStatusCode = (error: any, response: any) => {

        let _error = error || response.body;

        let e = httpStatusHelper.internalError('', _error);

        if (response) {
            if (response.statusCode == httpStatusCode.badrequest) {
                e = httpStatusHelper.badRequest('', _error)
            } else if (response.statusCode == httpStatusCode.unauthorized) {
                e = httpStatusHelper.unauthorized('')
            } else if (response.statusCode == httpStatusCode.notFound) {
                e = httpStatusHelper.notFound('')
            } else if (response.statusCode == httpStatusCode.conflict) {
                e = httpStatusHelper.conflict('')
            } else if (response.statusCode == httpStatusCode.locked) {
                e = httpStatusHelper.locked('')
            } else if (response.statusCode == httpStatusCode.teapot) {
                e = httpStatusHelper.teaPot('', _error)
            } else if (response.statusCode == httpStatusCode.gone) {
                e = httpStatusHelper.gone('')
            } else if (response.statusCode == httpStatusCode.notAcceptable) {
                e = httpStatusHelper.notAcceptable('')
            }

        }

        return e;
    }

}

export default httpStatusHelper;