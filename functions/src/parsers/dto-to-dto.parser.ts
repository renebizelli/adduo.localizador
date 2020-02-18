import baseParser from "./base.parser";
import monitoringAllowanceDto from "../dto/monitoring-allowance.dto";
import monitoringOptInDto from "../dto/monitoring-opt-in.dto";
import locale from "../locales/locale";
import '../prototypes/string.prototype';
import { cultureString } from "../enum/culture.enum";
import locationDto from "../dto/location.dto";
import fenceCheckDto from "../dto/fence-check.dto";
import { fenceStatusString } from "../enum/fence.enum";
import fenceCheckResultDto from "../dto/fence-check-result.dto";
import monitoringAcceptDto from "../dto/monitoring-accept.dto";
import requestContextDto from "../dto/request-context.dto";
import userDto from "../dto/user.dto";

class dtoToDtoParser extends baseParser {

    static allowanceToOptIn(allowance: monitoringAllowanceDto, culture: cultureString): monitoringOptInDto {

        let text = locale.get('text:opt-in', culture);

        let textWithName = text.naming(allowance.name);

        return <monitoringOptInDto>{
            text: textWithName
        }

    }

    static toFenceCheck(locationDto: locationDto, fence: fenceCheckResultDto, newStatus: fenceStatusString): fenceCheckDto {

        return <fenceCheckDto>{
            fenceId: fence._id,
            title: fence.title,
            location: locationDto.location,
            deviceId: locationDto.deviceId,
            culture: fence.culture,
            priority: fence.priority,
            uid: fence.uid,
            alias: fence.alias,
            monitorableUid: fence.monitored.uid,
            status: newStatus,
            occurredAt: locationDto.updatedAt
        }
    }

    static allowanceToAccept(allowance: monitoringAllowanceDto): monitoringAcceptDto {
        return <monitoringAcceptDto>
            {
                nameUserAllowed: allowance.name
            }
    }

    static userToRequestContext(user: userDto): requestContextDto {
        return <requestContextDto>{
            uid: user.uid,
            name: user.name,
            email: user.email,
            ts: "0"
        };
    }


}

export default dtoToDtoParser;