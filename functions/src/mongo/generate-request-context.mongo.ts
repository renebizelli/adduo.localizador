import requestContextDto from '../dto/request-context.dto'

import deviceSchema from '../models/device.schema';
import userSchema from '../models/user.schema';

import * as mongoose from 'mongoose';
import cultureEnum from '../enum/culture.enum';

class generateRequestContextMongo {

    static byUid = async (uid: string): Promise<requestContextDto> => {

        let model = await userSchema.findById(uid, { contact: 1, info: 1 });

        let dto: requestContextDto = new requestContextDto();

        if (model) {
            dto = <requestContextDto>{
                culture: model.info.culture || cultureEnum.culture(),
                name: model.info.name,
                email: model.contact.email,
                ts: '0',
                uid: uid
            };
        }

        return dto;
    }

    static byDeviceId = async (deviceId: string): Promise<requestContextDto> => {

        let model = await deviceSchema.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(deviceId) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userUid',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        uid: { $arrayElemAt: ["$user._id", 0] },
                        culture: {
                            $arrayElemAt: ["$user.info.culture", 0]
                        },
                        name: { $arrayElemAt: ["$user.info.name", 0] },
                        email: { $arrayElemAt: ["$user.contact.email", 0] },
                    }
                }
            ]
        );

        return <requestContextDto>{
            culture: model[0].culture || cultureEnum.culture(),
            name: model[0].name,
            email: model[0].email,
            ts: '0',
            uid: model[0].uid
        };
    }
}

export default generateRequestContextMongo;