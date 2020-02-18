import deviceModel from "../models/device.model";
import { deviceTypesString, deviceStatusString } from "../enum/device.enum";
import baseParser from "./base.parser";
import fenceDto from "../dto/fence.dto";
import geoPointDto from "../dto/geo-point.dto";
import { fencePriority } from "../enum/fence.enum";
import monitoringCodeModel from "../models/monitoring-code.model";
import monitoringCodeDto from "../dto/monitoring-code.dto";
import monitoringAllowanceDto from "../dto/monitoring-allowance.dto";
import { cultureString } from "../enum/culture.enum";
import fenceCheckResultDto from '../dto/fence-check-result.dto';
import fenceMonitoredDto from "../dto/fence-monitored.dto";
import userTokenDto from "../dto/user-token.dto";
import contactDto from "../dto/contact.dto";
import receiptDto from "../dto/receipt.dto";
import userDto from "../dto/user.dto";
import subscriptionSummaryDto from "../dto/subscription-summary.dto";
import textDto from "../dto/text.dto";
import weatherAlertDto from "../dto/weather-alert.dto";
import monitorableSelectedToMapDto from "../dto/monitorable-selected-to-map.dto";
import monitorableSelectedToAccountDto from "../dto/monitorable-selected-to-account.dto";
import monitorableUnselectedDto from "../dto/monitorable-unselected.dto";
import userWeatherAlertDto from "../dto/user-weather-alert.dto";
import { subscriptionStatusString } from "../enum/subscription.enum";
import productDto from "../dto/product.dto";
import productStoreDto from "../dto/product.store.dto";
import deviceDto from "../dto/device.dto";
import checkSelectedQuantityDto from "../dto/check-selected-quantity.dto";

class modelToDtoParser extends baseParser {

    static device(deviceModel: deviceModel): deviceDto {

        let dto = <deviceDto>{
            _id: deviceModel._id.toString(),
            deviceId: deviceModel._id.toString(),
            userUid: deviceModel.userUid,
            alias: deviceModel.alias,
            type: <deviceTypesString>deviceModel.type,
            status: <deviceStatusString>deviceModel.status,
        }

        return dto;
    }

    static fenceList(model: any): fenceDto {
        let fence = this.fence(model);
        fence.numberOfMonitoreds = model.monitored.length;
        return fence;
    }

    static fenceOne(model: any): fenceDto {

        let fence = this.fence(model);

        fence.numberOfMonitoreds = model.monitored.length;

        if (model.monitored && model.monitored.length) {
            for (let _monitored of model.monitored) {
                fence.monitoredIds.push(_monitored.userUid);
                fence.monitored.push(<fenceMonitoredDto>{
                    userUid: _monitored.userUid,
                    uid: _monitored.userUid,
                    alias: _monitored.alias,
                    status: _monitored.status
                });
            }
        }
        return fence;
    }

    static fence(model: any): fenceDto {

        return <fenceDto><any>{
            _id: model._id,
            location: <geoPointDto>{
                lat: model.location.coordinates[0],
                lng: model.location.coordinates[1]
            },
            lat: model.location.coordinates[0],
            lng: model.location.coordinates[1],
            radius: model.radius,
            priority: <fencePriority>model.priority,
            userUid: model.userUid,
            address: model.address,
            title: model.title,
            active: model.active,
            createdAt: model.createdAt,
            monitoredIds: [],
            monitored: []
        };
    }

    static monitoringCode(model: monitoringCodeModel): monitoringCodeDto {
        return <monitoringCodeDto>{
            code: model._id,
            uid: model.userUid
        }
    }

    static monitoringAllowance(model: any): monitoringAllowanceDto {
        return <monitoringAllowanceDto>{
            code: model._id,
            uid: model.userUid,
            culture: <cultureString>model.culture,
            name: model.name,
            productId: model.productId,
            subscriptionStatus: model.subscriptionStatus
        }
    }

    static fenceCheck(models: any[]): fenceCheckResultDto[] {

        let result: fenceCheckResultDto[] = [];

        for (let model of models) {
            result.push(<fenceCheckResultDto>{
                _id: model._id,
                title: model.title,
                radius: model.radius,
                priority: model.priority,
                uid: model.userUid,
                distance: model.distance,
                alias: model.alias,
                culture: model.culture,
                monitored: <fenceMonitoredDto>{
                    uid: model.monitored.uid,
                    status: model.monitored.status,
                    updatedAt: model.monitored.updatedAt
                }
            });
        }

        return result;
    }

    static userPushToken(model: any): userTokenDto {

        return <userTokenDto>{
            token: model.token.push,
            platform: model.currentSmartphone.platform
        }

    }

    static selectedToMap(model: any): monitorableSelectedToMapDto {

        let contact = <contactDto>{
            email: '',
            cellPhone: ''
        }

        if (model.contact) {
            contact.email = model.contact.email,
                contact.cellPhone = model.contact.cellPhone
        }

        return <monitorableSelectedToMapDto>{
            monitorableUid: model.userUid,
            userUid: model.userUid,
            deviceId: model.deviceId,
            alias: model.alias,
            contact: contact,
            ['selected']: true // deletar 
        };
    }

    static selectedToAccount(model: any): monitorableSelectedToAccountDto {

        return <monitorableSelectedToAccountDto>{
            monitorableUid: model.userUid,
            userUid: model.userUid,
            alias: model.alias,
            lockedUpTo: model.lockedUpTo,
            daysLeft: 0,
            canBeChanged: false
        };
    }

    static unselected(model: any): monitorableUnselectedDto {

        return <monitorableUnselectedDto>{
            monitorableUid: model.userUid,
            alias: model.alias,
        };
    }

    static subscriptioReceipt(model: any): receiptDto {
        return <receiptDto>{
            uid: model._id.uid,
            transactionId: model._id.transactionId,
            platform: model.platform,
            data: model.receipt,
            tryToSend: model.tryToSend,
            error: model.error
        }
    }

    static userDto(model: any): userDto {

        return <userDto>{
            uid: model._id,
            name: model.name,
            email: model.email,
            phone: model.phone,
            culture: model.culture,
            platform: model.platform,
            createdAt: model.createdAt
        }
    }


    static checkSelectedQuantityDto(model: any): checkSelectedQuantityDto {

        return <checkSelectedQuantityDto>{
            sku: model.sku,
            numberOfLicenses: model.numberOfLicenses,
            usedLicenses: model.usedLicenses
        }
    }


    

    static subscriptionSummary(model: any): subscriptionSummaryDto {

        let dto: subscriptionSummaryDto = new subscriptionSummaryDto();

        if (model) {
            dto.statusEnum = <subscriptionStatusString>model.statusEnum;
            dto.sku = model.sku;
            dto.active = model.active;
            dto.needsToFix = false;
            dto.numberOfLicenses = model.numberOfLicenses;
            dto.title = model.title;
            dto.subscriptionType = model.type;
            dto.isFree = false;
            dto.expiryTime = model.expiryTime;
            dto.daysLeft = model.daysLeft;
            dto.isProcessing = model.isProcessing;
        }

        return dto;
    }

    static text(model: any, culture: cultureString): textDto {

        return <textDto>{
            _id: model._id,
            text: model[cultureString.pt]
        }

    }

    static weatherAlert(model: any): weatherAlertDto {

        return <weatherAlertDto>{
            _id: model._id,
            expires: model.expires,
            description: model.description,
            instruction: model.instruction,
            event: model.event,
            urgency: model.urgency,
            severity: model.severity,
            sender: model.sender,
            code: model.code,
            createdAt: model.createdAt
        }
    }

    static userWeatherAlert(model: any): userWeatherAlertDto {

        return <userWeatherAlertDto>{
            id: model.weatherAlert
        }
    }


    static store(model: any, culture: string): productStoreDto {

        let store: any = new productStoreDto();

        for (let type in model.data[culture]) {

            for (let item of model.data[culture][type]) {

                store[type].push(
                    <productDto>{
                        sku: item.sku,
                        title: item.title,
                        description: item.description,
                        purchased: false
                    }
                );
            }
        }

        return store;
    }


}

export default modelToDtoParser;