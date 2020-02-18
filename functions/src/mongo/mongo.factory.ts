import userMongo from "./user.mongo";
import deviceSmartphoneMongo from "./device.smartphone.mongo";
import fenceMongo from "./fence.mongo";
import monitoringCodeMongo from "./monitoring-code.mongo";
import monitoringAllowanceMongo from "./monitoring-allowance.mongo";
import monitoringMonitorableMongo from "./monitoring-monitorable.mongo";
import fenceCheckMongo from './fence-check.mongo';
import locationHistoryMongo from "./location-history.mongo";
import subscriptionMongo from "./subscription.mongo";
import productMongo from "./product.mongo";
import subscriptionReceiptMongo from "./subscription-receipt.mongo";
import weatherAlertMongo from "./weather-alert.mongo";
import textMongo from "./text.mongo";
import monitoringSelectedMongo from "./monitoring-selected.mongo";
import constantMongo from "./constant.mongo";
import contentMongo from "./content.mongo";
import deviceIotMongo from "./device.iot.mongo";
import deviceMongo from "./device.mongo";

class mongoFactory {

    static user() {
        return new userMongo();
    }

    static device() {
        return new deviceMongo();
    }

    static deviceSmartphone() {
        return new deviceSmartphoneMongo();
    }

    static deviceIot() {
        return new deviceIotMongo();
    }

    static fence() {
        return new fenceMongo();
    }

    static monitoringCode() {
        return new monitoringCodeMongo();
    }

    static monitoringAllowance() {
        return new monitoringAllowanceMongo();
    }

    static monitoringMonitorable() {
        return new monitoringMonitorableMongo();
    }

    static monitoringSelected() {
        return new monitoringSelectedMongo();
    }    

    static fenceCheck() {
        return new fenceCheckMongo();
    }

    static locationHistory() {
        return new locationHistoryMongo();
    }

    static subscription() {
        return new subscriptionMongo();
    }

    static subscriptionReceipt() {
        return new subscriptionReceiptMongo();
    }

    static product() {
        return new productMongo();
    }

    static weatherAlert()
    {
        return new weatherAlertMongo();
    }

    static text()
    {
        return new textMongo();
    }

    static constant() {
        return new constantMongo();
    }    

    static content() {
        return new contentMongo();
    }    

}

export default mongoFactory;