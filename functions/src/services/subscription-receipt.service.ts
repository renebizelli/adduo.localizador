import baseService from "./base.service";
import requestContextDto from "../dto/request-context.dto";
import mongoFactory from "../mongo/mongo.factory";
import receiptDto from "../dto/receipt.dto";
import serviceFactory from "./service.factory";
import { changingTypesString } from "../enum/changing.enum";
import config from "../config/config";
import httpHelper from "../helpers/http.helper";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";
import receiptToAdminDto from "../dto/receipt-to-admin.dto";
import httpStatusHelper from "../helpers/http-status.helper";
import requestToDtoParser from "../parsers/request-to-dto.parser";
import subscriptionUpdateDto from "../dto/subscription-update.dto";

class subscriptionReceiptService extends baseService {

    private _subscriptionReceiptMongo = mongoFactory.subscriptionReceipt();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.receipt);
    }

    add = async (receipt: receiptDto) => {

        let userService = serviceFactory.user(this._context);
        let subscriptionService = serviceFactory.subscription(this._context);

        let user = await userService.basicOne();

        if (user) {
            receipt.platform = user.platform;
            await this._subscriptionReceiptMongo.add(this._context.uid, receipt);
            await subscriptionService.markProcessing();
            await userService.changing(changingTypesString.receipt, receipt.transactionId);
            await this.history(actionEnum.add, receipt.transactionId);
        }
        else {
            throw httpStatusHelper.notFound('');
        }
    }

    sendToAdmin = async (transactionId: string) => {

        try {

            let receiptToAdmin = await this._prepateDtoToSendAdmin(transactionId);

            let processedReceiptDto = await this._sendTo(receiptToAdmin, transactionId);

            await this._toProcessAdminResult(processedReceiptDto);

            await this._updateAsProcessed(processedReceiptDto.transactionId);

        }
        catch (error) {
            await this._processError(transactionId, error);
            throw error;
        }
    }

    private _processError = async (transactionId: string, error: any) => {

        await this._subscriptionReceiptMongo.addError(this._context.uid, transactionId, error);

        this.log(transactionId, error, 'subscription-receipt.service.sendToAdmin()');

        let receipt = await this._subscriptionReceiptMongo.one(this._context.uid, transactionId);

        if (receipt) {
            if (receipt.tryToSend < 5) {
                let userService = serviceFactory.user(this._context);
                await userService.changingForce(changingTypesString.receipt, transactionId);
            }
        }

    }

    private _prepateDtoToSendAdmin = async (transactionId: string) => {

        let receipt = await this._subscriptionReceiptMongo.one(this._context.uid, transactionId);

        let receiptToAdmin = <receiptToAdminDto>receipt;

        receiptToAdmin.name = this._context.name;
        receiptToAdmin.email = this._context.email;

        return receiptToAdmin;
    }

    private _sendTo = async (receipt: receiptToAdminDto, transactionId: string) => {
        let adminConfig = config.adminConfig();
        await this.history(actionEnum.send, transactionId, receipt);
        let result = await httpHelper.post(adminConfig["url-to-send-receipt"], receipt);
        await this.history(actionEnum.received, transactionId, result);
        return requestToDtoParser.adminToSubscriptionUpdate(result);
    }

    private _toProcessAdminResult = async (processedReceiptDto: subscriptionUpdateDto) => {
        let subscriptionService = serviceFactory.subscription(this._context);
        await subscriptionService.toProcessSubscription(processedReceiptDto);
    }

    private _updateAsProcessed = async (transactionId: string) => {
        await this._subscriptionReceiptMongo.processedSuccessUpdate(this._context.uid, transactionId);
        await this.history(actionEnum.processed, transactionId);
    }

}

export default subscriptionReceiptService;