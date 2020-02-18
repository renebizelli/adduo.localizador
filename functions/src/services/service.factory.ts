import userService from "./user.service";
import sessionService from "./session.service";
import deviceSmartphoneService from "./device.smartphone.service";
import requestContextDto from "../dto/request-context.dto";
import locationService from "./location.service";
import locationDto from "../dto/location.dto";
import { typeLocationIotEnum } from "../enum/type-location-iot.enum";
import locationRootService from "./location-root.service";
import locationParamsService from "./location-params.service";
import locationLocationService from "./location-location.service";
import fenceService from "./fence.service";
import monitoringCodeService from "./monitoring-code.service";
import monitoringAllowanceService from "./monitoring-allowance.service";
import monitoringMonitorableService from "./monitoring-monitorable.service";
import pushService from "./push.service";
import alertService from "./alert.service";
import notificationManager from "./notification.manager";
import fenceCheckStatusService from './fence-check.service';
import subscriptionService from './subscription.service';
import productService from './product.service';
import weatherAlertService from "./weather-alert.service";
import subscriptionReceiptService from "./subscription-receipt.service";
import userOverdueService from "./user-overdue.service";
import textService from "./text.service";
import monitoringSelectedService from "./monitoring-selected.service";
import weatherAlertCheckService from "./weather-alert-check.service";
import communicationService from "./communication.service";
import userFreeService from "./user-free.service";
import constantService from "./constant.service";
import deviceIotService from "./device.iot.service";
import contentService from "./content.service";
import emailService from "./email-queue.service";

class serviceFactory {

    static session(context: requestContextDto) {
        return new sessionService(context);
    }

    static user(context: requestContextDto) {
        return new userService(context);
    }

    static deviceSmartphone(context: requestContextDto) {
        return new deviceSmartphoneService(context);
    }

    static deviceIot(context: requestContextDto) {
        return new deviceIotService(context);
    }

    static location(context: requestContextDto) {
        return new locationService(context);
    }

    static monitoringCode(context: requestContextDto) {
        return new monitoringCodeService(context);
    }

    static monitoringAllowance(context: requestContextDto) {
        return new monitoringAllowanceService(context);
    }

    static monitoringSelected(context: requestContextDto) {
        return new monitoringSelectedService(context);
    }


    static monitoringMonitorable(context: requestContextDto) {
        return new monitoringMonitorableService(context);
    }

    static fenceCheckStatus(context: requestContextDto) {
        return new fenceCheckStatusService(context);
    }

    static subscription(context: requestContextDto) {
        return new subscriptionService(context);
    }

    static subscriptionReceipt(context: requestContextDto) {
        return new subscriptionReceiptService(context);
    }

    static locationType(context: requestContextDto, dto: locationDto) {

        if (dto.type == typeLocationIotEnum.position) {
            return new locationRootService()
        }
        else if (dto.type == typeLocationIotEnum.status) {
            return new locationParamsService()
        }
        else {
            return new locationLocationService()
        }
    }

    static fence(context: requestContextDto) {
        return new fenceService(context);
    }

    static push(context: requestContextDto) {
        return new pushService(context);
    }

    static alert(context: requestContextDto) {
        return new alertService(context);
    }

    static notification(context: requestContextDto) {
        return new notificationManager(context);
    }

    static userOverdue() {
        return new userOverdueService();
    }

    static userFree() {
        return new userFreeService();
    }

    static product(context: requestContextDto) {
        return new productService(context);
    }

    static weatherAlert() {
        return new weatherAlertService();
    }

    static weatherAlertCheck(context: requestContextDto) {
        return new weatherAlertCheckService(context);
    }

    static text(context: requestContextDto) {
        return new textService(context);
    }

    static communication(context: requestContextDto) {
        return new communicationService(context);
    }

    static constant() {
        return new constantService();
    }

    static content(context: requestContextDto) {
        return new contentService(context);
    }


    static email() {
        return new emailService( );
    }


    


}

export default serviceFactory;