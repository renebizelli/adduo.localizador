
import express = require('express');
import baseController from './base.controller';
import controlerInterface from '../interfaces/controller.interface';
import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import { historyTypeEnum } from '../enum/history.enum';

class textController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.text);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('text/:id'), this.one);
    }

    private one = async (req: express.Request, res: express.Response) => {

        try {

            let _textService = serviceFactory.text(req.context);

            let textDto = await _textService.one(req.params.id);

            httpStatusHelper.sendOk(res, textDto);
        }
        catch (error) {
            this.logErrorAndSend(req, res, req.params.id, error, 'text.controller.one()');
        }
    }


}

export default textController;