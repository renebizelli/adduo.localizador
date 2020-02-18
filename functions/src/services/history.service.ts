import { historyTypeEnum } from "../enum/history.enum";
import { actionEnum } from "../enum/action.enum";
import historySchema from "../models/history.schema";
import { historyItemModel } from "../models/history.model";
import timeStampHelper from "../helpers/timestamp.helper";

class historyService {

    static log = async (uid: string, type: historyTypeEnum, action: actionEnum, _id?: string, afterObject?: any) => {

        let ts = timeStampHelper.get();

        let item = <historyItemModel>{
            type: type,
            action: action,
            targetId: _id,
            afterObject: afterObject,
            occurredAt: ts
        };

        return historySchema.updateOne({ _id: uid }, {
            $push: {
                items: item
            }
        }, { upsert: true } );
    }
}

export default historyService;