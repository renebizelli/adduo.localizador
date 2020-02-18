import logSchema from "../models/log.schema";
import errorDto from "../dto/error.dto";
import logModel from "../models/log.model";
import { historyTypeEnum } from "../enum/history.enum";

class logMongo {

    save = async (type: historyTypeEnum, idType: string, error: errorDto, uid: string, data: any, params: any, headers: any, url: string, method: string, _function: string) => {

        try {

            let log: logModel = {
                userUid: uid,
                message: error.message || "empty",
                stack: error.stack || "empty",
                function: _function,
                type: type,
                idType: idType || "empty",
                body: data || "empty",
                params: params || "empty",
                headers: headers,
                endpoint: {
                    url: url || "empty",
                    method: method || "empty"
                }
            };

            (new logSchema(log)).save();

        } catch (error) { }

    }

}

export default logMongo