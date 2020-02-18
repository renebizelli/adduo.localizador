import baseService from "./base.service";
import requestContextDto from "../dto/request-context.dto";
import mongoFactory from "../mongo/mongo.factory";
import serviceFactory from "./service.factory";
import { changingTypesString } from "../enum/changing.enum";
import subscriptionUpdateDto from "../dto/subscription-update.dto";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";
import { productEnumString, productTypesString } from "../enum/product.enum";
import locale from "../locales/locale";
import '../prototypes/string.prototype';
import userDto from "../dto/user.dto";
import timeStampHelper from "../helpers/timestamp.helper";
import { subscriptionStatusString } from "../enum/subscription.enum";
import productDto from "../dto/product.dto";

class subscriptionService extends baseService {

    private _subscriptionMongo = mongoFactory.subscription();
    private _constantService = serviceFactory.constant();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.subscription);
    }

    one = async () => {

        let subscription = await this._subscriptionMongo.one(this._context.uid);

        subscription.isFree = subscription.sku == productEnumString.free;
        subscription.needsToFix = false;

        let key = subscription.numberOfLicenses == 1 ? "subscription.description-product-single" : "subscription.description-product-plural";
        let description = locale.getText(key, this._context.culture);

        description = description.stringFormat([subscription.numberOfLicenses.toString()]);
        subscription.description = description

        subscription.status = locale.getText('subscription.status.status-{0}'.stringFormat([subscription.statusEnum]), this._context.culture);

        return subscription;
    }

    markProcessing = async () => {
        return this._subscriptionMongo.markProcessing(this._context.uid);
    }

    freeUpdate = async () => {

        let createdAt = timeStampHelper.get();
        let freeDaysAllowed = await this._constantService.getFreeDaysAllowed();
        let expiryTime = timeStampHelper.addDays(createdAt, freeDaysAllowed);

        let subscriptionUpdateDto = <subscriptionUpdateDto>{
            uid: this._context.uid,
            subscriptionId: "0",
            active: true,
            lastStatus: subscriptionStatusString.active,
            startTime: createdAt,
            expiryTime: expiryTime,
            resumeTime: 0,
            product: <productDto>{
                sku: productEnumString.free,
                title: 'Foxtter Free',
                numberOfLicenses: 0,
                type: productTypesString.monthly
            }
        };

        await this._subscriptionMongo.update(subscriptionUpdateDto);
        await this._subscriptionMongo.selectedAll(this._context.uid);

        let userService = serviceFactory.user(this._context);
        await userService.changing(changingTypesString.subscription);
    }

    addFreeSubscription = async (user: userDto) => {

        let freeDaysAllowed = await this._constantService.getFreeDaysAllowed();
        let expiryTime = timeStampHelper.addDays(user.createdAt, freeDaysAllowed);

        let subscriptionUpdateDto = <subscriptionUpdateDto>{
            uid: user.uid,
            subscriptionId: "0",
            active: true,
            lastStatus: subscriptionStatusString.active,
            startTime: user.createdAt,
            expiryTime: expiryTime,
            resumeTime: 0,
            product: <productDto>{
                sku: productEnumString.free,
                title: 'Foxtter Free',
                numberOfLicenses: 0,
                type: productTypesString.monthly
            }
        };

        await this._subscriptionMongo.update(subscriptionUpdateDto);

        await this.history(actionEnum.add, user.uid, subscriptionUpdateDto);
    }

    toProcessSubscription = async (processedReceiptDto: subscriptionUpdateDto) => {

        let currentSubscription = await this.one();

        await this._subscriptionMongo.update(processedReceiptDto);

        let clearSelected = currentSubscription.sku != processedReceiptDto.product.sku;
        if (clearSelected) {
            await this._subscriptionMongo.clearSelected(processedReceiptDto.uid);
        }

        let userService = serviceFactory.user(this._context);
        await userService.changing(changingTypesString.subscription);

        await this.history(actionEnum.update, processedReceiptDto.subscriptionId, processedReceiptDto);

    }


}

export default subscriptionService; 