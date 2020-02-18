import * as express from 'express';
import { Router } from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import controlerInterface from '../interfaces/controller.interface';

import locale from '../locales/locale';
import httpStatusHelper from '../helpers/http-status.helper';
import controllerFactory from '../controllers/controller.factory';
import serviceFactory from '../services/service.factory';

class mainApplication {

    private _express: express.Application = express();

    constructor() {
        this.locales();
        this.middlewares();
        this.controllers();
    }

    public getApp() {
        return this._express;
    }

    private async locales() {
        await locale.load();
    }

    private middlewares() {

        this._express.use(bodyParser.urlencoded({ extended: true }));
        this._express.use(cors());

        this._express.use((req, res, next) => {
            let _sessionService = serviceFactory.session(req.context);
            _sessionService.setRequestContext(req);
            next();
        });

        this._express.use('*/restricted/*', async (req, res, next) => {

            try {

                let _sessionService = serviceFactory.session(req.context);
                await _sessionService.authProcess(req);
                await _sessionService.preventSimultaneousAuth(req);
                next();
            }
            catch (error) {
                httpStatusHelper.sendError(req, res, error);
            }

        });

    }

    private controllers() {

        let controllers: controlerInterface[] = controllerFactory.all();

        const router: Router = express.Router();

        controllers.forEach((c) => {
            c.setRouter(router);
        });

        this._express.use('/', router);
    }
}

export default mainApplication;