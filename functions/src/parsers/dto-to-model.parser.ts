import baseParser from "./base.parser";
import deviceSmartphoneDto from "../dto/device.smartphone.dto";
import deviceModel from "../models/device.model";
import { deviceTypesString } from "../enum/device.enum";
import fenceDto from "../dto/fence.dto";
import fenceModel from "../models/fence.model";
import fenceMonitoredModel from "../models/fence-monitored.model";
import timeStampHelper from "../helpers/timestamp.helper";
import { fenceStatusString } from "../enum/fence.enum";
import locationDto from "../dto/location.dto";
import fenceCheckDto from "../dto/fence-check.dto";
import locationHistoryFenceModel from "../models/location-history-fence.model";
import locationHistoryLocationModel from "../models/location-history-location.model";
import deviceIotDto from "../dto/device.iot.dto";

class dtoToModelParser extends baseParser {

    static deviceSmartphone(dto: deviceSmartphoneDto): deviceModel {

        let model = <deviceModel>{
            userUid: dto.userUid,
            alias: dto.alias,
            type: deviceTypesString.smartphone,
            status: dto.status,
            detail: {
                platform: dto.platform
            }
        };

        return model;
    }

    static deviceIot(dto: deviceIotDto): deviceModel {

        let model = <deviceModel>{
            userUid: dto.userUid,
            alias: dto.alias,
            type: deviceTypesString.iot,
            status: dto.status,
            detail: {
                externalId: dto.externalId,
                token: dto.token,
            }
        };

        return model;
    }

    static fence(dto: fenceDto): fenceModel {

        let monitoreds: fenceMonitoredModel[] = []

        let ts = timeStampHelper.get();

        if (dto.monitoredIds && dto.monitoredIds.length) {
            for (let uid of dto.monitoredIds) {
                monitoreds.push(<fenceMonitoredModel>{
                    uid: uid,
                    status: fenceStatusString.none,
                    createdAt: ts,
                    updatedAt: ts
                });
            }
        }

        let model = <fenceModel>{
            _id: dto._id,
            title: dto.title,
            address: dto.address,
            radius: dto.radius,
            priority: dto.priority,
            monitored: monitoreds,
            userUid: dto.userUid,
            location: {
                type: 'Point',
                coordinates: [dto.location.lat, dto.location.lng]
            },
            active: dto.active,
        };

        return model;
    }

    static locationHistory(locationDto: locationDto): locationHistoryLocationModel {

        return <locationHistoryLocationModel>{
            deviceId: locationDto.deviceId,
            location: {
                type: "Point",
                coordinates: [locationDto.location.lat, locationDto.location.lng]
            },
            altitude: locationDto.altitude,
            speed: locationDto.speed,
            accuracy: locationDto.accuracy,
            occurredAt: locationDto.updatedAt
        }
    }


    static fenceHistory(fence: fenceCheckDto): locationHistoryFenceModel {

        return <locationHistoryFenceModel>{
            location: {
                type: "Point",
                coordinates: [fence.location.lat, fence.location.lng]
            },
            deviceId: fence.deviceId,
            fenceId: fence.fenceId,
            status: fence.status,
            occurredAt: fence.occurredAt
        };
    }
}

export default dtoToModelParser;