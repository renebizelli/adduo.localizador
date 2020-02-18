import baseService from "./base.service";

import requestContextDto from "../dto/request-context.dto";
import monitoringCodeDto from "../dto/monitoring-code.dto";

import stringHelper from "../helpers/string.helper";
import mongoFactory from "../mongo/mongo.factory";
import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";

class monitoringCodeService extends baseService {

    private _monitoringMongo = mongoFactory.monitoringCode();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.requestcode);
    }

    create = async (trial: number = 0): Promise<monitoringCodeDto> => {

        try {

            let code = stringHelper.generateCode(global.config.monitoring['request-code-size']);

            let dto = <monitoringCodeDto>{
                code: code,
                uid: this._context.uid
            };

            await this._monitoringMongo.create(dto);

            await this.history(actionEnum.create, code)

            return dto;

        }
        catch (error) {

            if (trial == global.config.monitoring['try-to-create-request-code']) {
                throw error;
            } else {
                return this.create(++trial);
            }

        }
    }


    one = async () => {

        let codeDto = await this._monitoringMongo.one(this._context.uid);

        if (!codeDto) {
            codeDto = await this.create()
        }

        return codeDto;
    }


}

export default monitoringCodeService;