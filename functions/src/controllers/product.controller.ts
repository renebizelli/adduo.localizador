import baseController from './base.controller';
import controlerInterface from "../interfaces/controller.interface";
import express = require('express');
import serviceFactory from '../services/service.factory';
import httpStatusHelper from '../helpers/http-status.helper';
import { historyTypeEnum } from '../enum/history.enum';

class productController extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.product);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('products/home'), this.homeOne);
        router.get(this.createRestrictedEndpoint('products/store'), this.storeOne);
    }

    private homeOne = async (req: express.Request, res: express.Response) => {

        try {
            let _productService = serviceFactory.product(req.context);
            let data = await _productService.homeOne();
            httpStatusHelper.sendOk(res, data);
        }
        catch (error) {
            this.logErrorAndSend(req, res, 'home', error, 'product.controller.homeOne()');
        }

    }

    private storeOne = async (req: express.Request, res: express.Response) => {

        try {
            let _productService = serviceFactory.product(req.context);
            let data = await _productService.storeOne();
            httpStatusHelper.sendOk(res, data);
        }
        catch (error) {
            this.logErrorAndSend(req, res, 'store', error, 'product.controller.storeOne()');
        }

    }

}

export default productController;