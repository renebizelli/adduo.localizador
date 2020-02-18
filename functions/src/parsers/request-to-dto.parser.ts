
import express = require("express");

import timeStampHelper from "../helpers/timestamp.helper";

import setupDto from "../dto/setup.dto";
import deviceSmartphoneDto from "../dto/device.smartphone.dto";

import { deviceTypesString } from "../enum/device.enum";
import { typeLocationIotEnum } from "../enum/type-location-iot.enum";

import userDto from "../dto/user.dto";
import locationDto from "../dto/location.dto";
import geoPointDto from "../dto/geo-point.dto";
import fenceDto from "../dto/fence.dto";
import { fencePriority } from "../enum/fence.enum";
import monitoringCodeDto from "../dto/monitoring-code.dto";
import notificationQueueDto from "../dto/notification-queue.dto";
import monitoringMonitorableDto from "../dto/monitoring-monitorable.dto";
import monitoringSelectedDto from "../dto/monitoring-selected.dto";
import userRefreshTokenDto from "../dto/user-refresh-token.dto";
import sessionPasswordCodeDto from '../dto/session-password-code.dto';
import receiptDto from "../dto/receipt.dto";
import subscriptionUpdateDto from "../dto/subscription-update.dto";
import deviceIotDto from "../dto/device.iot.dto";
import emailQueueDto from "../dto/email.queue.dto";

class requestToDtoParser {

    static setup(req: express.Request): setupDto {

        return <setupDto>{
            ts: timeStampHelper.get(),
            platform: req.body.platform,
            deviceId: req.body.deviceId,
            culture: req.context.culture,
            uid: req.context.uid
        };

    }

    static deviceSmartphone(req: express.Request): deviceSmartphoneDto {

        return <deviceSmartphoneDto>{
            _id: req.params.deviceId,
            deviceId: req.params.deviceId,
            userUid: req.context.uid,
            alias: req.body.alias,
            type: deviceTypesString.smartphone,
            platform: req.body.platform
        };

    }

    static deviceIot(req: express.Request): deviceIotDto {

        return <deviceIotDto>{
            _id: req.params.deviceId,
            deviceId: req.params.deviceId,
            userUid: req.context.uid,
            alias: req.body.alias,
            type: deviceTypesString.iot,
            externalId: req.body.externalId,
            token: req.body.token
        };

    }


    static user(req: express.Request): userDto {

        return <userDto>{
            uid: req.context.uid,
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phoneNumber,
            password: req.body.password,
            culture: req.context.culture
        };

    }

    static location(req: express.Request): locationDto {

        return <locationDto>{
            uid: req.context.uid,
            deviceId: req.params.deviceId,
            location: <geoPointDto>{
                lat: parseFloat(req.body && req.body.lat),
                lng: parseFloat(req.body && req.body.lng),
            },
            direction: req.body.direction || 0,
            altitude: req.body.altitude || 0,
            speed: req.body.speed || 0,
            accuracy: req.body.accuracy || 0,
            battery: req.body.battery || 0,
            accuracyState: req.body.accuracyState || '',
            updatedAt: timeStampHelper.get(),
            type: <typeLocationIotEnum>req.body.type
        }
    }

    static locationToCheckFence(req: express.Request): locationDto {

        return <locationDto>{
            deviceId: req.body.deviceId,
            location: <geoPointDto>{
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng),
            },
            direction: req.body.direction || 0,
            altitude: req.body.altitude || 0,
            speed: req.body.speed || 0,
            accuracy: req.body.accuracy || 0,
            battery: req.body.battery || 0,
            accuracyState: req.body.accuracyState || '',
            uid: req.body.uid,
            updatedAt: req.body.updatedAt
        }
    }


    static fence(req: express.Request): fenceDto {

        let monitoredIds = [];

        if (typeof req.body.monitoredIds === 'string') {
            monitoredIds.push(req.body.monitoredIds);
        }
        else {
            monitoredIds = req.body.monitoredIds;
        }

        return <fenceDto>{
            _id: req.params.fenceId,
            location: <geoPointDto>{
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng)
            },
            radius: req.body.radius,
            priority: <fencePriority>(parseInt(req.body.priority)),
            monitoredIds: monitoredIds,
            userUid: req.context.uid,
            address: req.body.address,
            title: req.body.title,
            active: req.body.active || true
        };
    }

    static monitoringOptInCode(req: express.Request): monitoringCodeDto {

        return <monitoringCodeDto>{
            code: req.params.code
        };
    }


    static monitoringMonitorable(req: express.Request): monitoringMonitorableDto {

        return <monitoringMonitorableDto>{
            uid: req.context.uid,
            monitorableUid: req.params.monitorableUid,
            alias: req.body.alias,
            active: <boolean>req.body.active,
            selected: <boolean>req.body.selected
        };
    }

    static monitoringAcceptCode(req: express.Request): monitoringCodeDto {

        return <monitoringCodeDto>{
            code: req.body.code
        };
    }

    static notificationQueue(req: express.Request): notificationQueueDto {
        return <notificationQueueDto>{
            monitoredUid: req.body.monitoredUid || 0,
            idType: req.body.idType || 0,
            uid: req.body.uid,
            title: req.body.title,
            body: req.body.body,
            occurredAt: req.body.occurredAt,
            type: req.body.type,
            priority: req.body.priority || 0
        }
    }

    static refreshToken(req: express.Request): userRefreshTokenDto {
        return <userRefreshTokenDto>{
            uid: req.context.uid,
            token: req.body.token
        }
    }

    static sessionValidateCode(req: express.Request): sessionPasswordCodeDto {
        return <sessionPasswordCodeDto>{
            code: req.body.oobCode
        }
    }

    static changePassword(req: express.Request): sessionPasswordCodeDto {
        return <sessionPasswordCodeDto>{
            code: req.body.oobCode,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }
    }

    static receipt(req: express.Request): receiptDto {

        return <receiptDto>{
            transactionId: req.params.transactionId,
            uid: req.context.uid,
            data: req.body
        }

    }

    static bodyToSubscriptionUpdate(req: express.Request): subscriptionUpdateDto {
        return this.adminToSubscriptionUpdate(req.body);
    }

    static adminToSubscriptionUpdate(result: any): subscriptionUpdateDto {

        return <subscriptionUpdateDto>{
            uid: result.uid,
            transactionId: result.transactionId,
            subscriptionId: result.subscriptionId,
            active: result.active,
            lastStatus: result.last_status,
            startTime: timeStampHelper.convertDatetime(result.startTime),
            expiryTime: timeStampHelper.convertDatetime(result.expiryTime),
            resumeTime: timeStampHelper.convertDatetime(result.resumeTime),
            product: {
                sku: result.plan && result.plan.id,
                title: result.plan && result.plan.name,
                numberOfLicenses: result.plan && result.plan.licenses,
                type: result.plan && result.plan.period.toString().toLowerCase()
            }
        };

    }


    static monitoringSelected(req: express.Request): monitoringSelectedDto {
        return <monitoringSelectedDto>{
            monitorableUid: req.body.monitorableUid,
            allowedUid: req.context.uid
        }
    }

    static email(req: express.Request): emailQueueDto {

        return <emailQueueDto>{
            email: req.body.email,
            name: req.body.name,
            title: req.body.title,
            message: req.body.message
        };

    }


}

export default requestToDtoParser;