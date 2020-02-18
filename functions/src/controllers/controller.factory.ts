import deviceController from "./device.controller";
import userController from "./user.controller";
import sessionController from "./session.controller";
import locationController from "./location.controller";
import fenceController from "./fence.controller";
import monitoringCodeController from "./monitoring-code.controller";
import monitoringAllowanceController from "./monitoring-allowance.controller";
import pushController from "./push.controller";
import alertController from "./alert.controller";
import monitoringMonitorableController from "./monitoring-monitorable.controller";
import testsController from "./tests.controller";
import subscriptionController from "./subscription.controller";
import productController from "./product.controller";
import weatherAlertController from "./weather-alert.controller";
import subscriptionReceiptController from "./subscription-receipt.controller";
import textController from "./text.controller";
import monitoringSelectedController from "./monitoring-selected.controller";
import deviceIotController from "./device.iot.controller";
import deviceSmartphoneController from "./device.smartphone.controller";
import contentController from "./content.controller";
import infoController from "./info-controller";
import emailController from "./email.controller";

class controllerFactory {

    static user() {
        return new userController();
    }

    static device() {
        return new deviceController();
    }

    static session() {
        return new sessionController();
    }

    static location() {
        return new locationController();
    }

    static fence() {
        return new fenceController();
    }

    static monitoringCode() {
        return new monitoringCodeController();
    }

    static monitoringAllowance() {
        return new monitoringAllowanceController();
    }

    static monitoringMonitorable() {
        return new monitoringMonitorableController();
    }

    static monitoringSelected() {
        return new monitoringSelectedController();
    }

    static push() {
        return new pushController();
    }

    static alert() {
        return new alertController();
    }

    static subscription() {
        return new subscriptionController();
    }

    static subscriptionReceipt() {
        return new subscriptionReceiptController();
    }

    static product() {
        return new productController();
    }

    static weatherAlert() {
        return new weatherAlertController();
    }

    static text() {
        return new textController();
    }

    static deviceIot() {
        return new deviceIotController();
    }

    static deviceSmartphone() {
        return new deviceSmartphoneController();
    }

    static content() {
        return new contentController();
    }

    static info() {
        return new infoController();
    }

    static email() {
        return new emailController();
    }



    static all() {
        return [
            controllerFactory.user(),
            controllerFactory.device(),
            controllerFactory.session(),
            controllerFactory.location(),
            controllerFactory.fence(),
            controllerFactory.monitoringCode(),
            controllerFactory.monitoringAllowance(),
            controllerFactory.monitoringMonitorable(),
            controllerFactory.push(),
            controllerFactory.alert(),
            controllerFactory.subscription(),
            new testsController(),
            controllerFactory.product(),
            controllerFactory.weatherAlert(),
            controllerFactory.subscriptionReceipt(),
            controllerFactory.text(),
            controllerFactory.monitoringSelected(),
            controllerFactory.deviceIot(),
            controllerFactory.deviceSmartphone(),
            controllerFactory.content(),
            controllerFactory.info(),
            controllerFactory.email()
        ]
    }

}

export default controllerFactory;