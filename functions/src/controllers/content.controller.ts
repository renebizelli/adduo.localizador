
import express = require('express');
import baseController from './base.controller';
import controlerInterface from '../interfaces/controller.interface';
import httpStatusHelper from '../helpers/http-status.helper';
import serviceFactory from '../services/service.factory';
import '../prototypes/string.prototype';
import { contentString } from '../enum/content.enum';
import { historyTypeEnum } from '../enum/history.enum';

class contentController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.content);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('content/{0}'.stringFormat([contentString.bannerHome])), this.bannerHomeOne);
    }

    private bannerHomeOne = async (req: express.Request, res: express.Response) => {

        try {

            let _contentService = serviceFactory.content(req.context);

            let content = await _contentService.getBannerHome();

            httpStatusHelper.sendOk(res, content);

        }
        catch (error) {
            this.logErrorAndSend(req, res, 'banner-home', error, 'content.controller.bannerHomeOne()');
        }
    }


}

export default contentController;