import endpointHelper from "../helpers/endpoint.helper";
import express = require("express");
import errorDto from "../dto/error.dto";
import logService from "../services/log.service";
import { historyTypeEnum } from "../enum/history.enum";
import serviceFactory from "../services/service.factory";
import requestContextDto from "../dto/request-context.dto";
import httpStatusHelper from "../helpers/http-status.helper";

class baseController {

    private endpointHelper: endpointHelper = new endpointHelper();

    private _historyType: historyTypeEnum = historyTypeEnum.none;

    constructor(historyType?: historyTypeEnum) {
        this._historyType = historyType || historyTypeEnum.none;
    }

    createPublicEndpoint(path: string): string {
        return this.endpointHelper.createPublic(path);
    }

    createRestrictedEndpoint(path: string): string {
        return this.endpointHelper.createRestricted(path);
    }

    createPrivateEndpoint(path: string): string {
        return this.endpointHelper.createPrivate(path);
    }

    logErrorAndSend(req: express.Request, res: express.Response, idType: string, error: errorDto, namespace: string): void {
        logService.logErrorAndSend(req, res, this._historyType, idType, error, namespace);
    }

    cl(title: string, o: any = {}): void {
        console.log(">>>>>> ", title, JSON.stringify(o));
    }

    isActiveSubscription = async (context: requestContextDto) => {

        let subscriptionService = serviceFactory.subscription(context);

        let summarySubscription = await subscriptionService.one();

        if (!summarySubscription.active) {
            throw httpStatusHelper.paymentRequired()
        }

    }


}

export default baseController