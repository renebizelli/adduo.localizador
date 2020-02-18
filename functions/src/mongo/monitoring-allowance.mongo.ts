
import modelToDtoParser from "../parsers/model-to-dto.parser";
import monitoringAllowanceDto from "../dto/monitoring-allowance.dto";
import requestContextDto from "../dto/request-context.dto";
import userSchema from "../models/user.schema";
import deviceDto from "../dto/device.dto";

class monitoringAllowanceMongo {


    allowedMany = async (uid: string) => {

        let query = [
            {
                $match: { _id: uid }
            },
            {
                $unwind: '$monitoring.allowed'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'monitoring.allowed',
                    foreignField: '_id',
                    as: 'monitorable'
                }
            },
            {
                $project:
                {
                    _id: { $arrayElemAt: ["$monitorable._id", 0] },
                    name: { $arrayElemAt: ["$monitorable.info.name", 0] },
                    culture: { $arrayElemAt: ["$monitorable.info.culture", 0] },
                    platform: { $arrayElemAt: ["$monitorable.currentSmartphone.platform", 0] },
                    email: { $arrayElemAt: ["$monitorable.contact.email", 0] },
                    phone: { $arrayElemAt: ["$monitorable.contact.phone", 0] },
                    subscription: { $arrayElemAt: ["$monitorable.subscription", 0] },
                    createdAt: { $arrayElemAt: ["$monitorable.info.createdAt", 0] }
                }
            }
        ];

        let models = await this._aggregate(query);
        let dtos = [];

        for (let model of models) {
            let dto = modelToDtoParser.userDto(model);
            dtos.push(dto);
        }

        return dtos;
    }

    addMonitorable = async (allowanceDto: monitoringAllowanceDto, monitorable: requestContextDto, ts: number) => {

        //##transaction

        await this._updateOne({
            _id: monitorable.uid
        }, {
            $addToSet: {
                'monitoring.allowed': allowanceDto.uid
            }
        });

        await this._updateOne({
            _id: allowanceDto.uid
        }, {
            $push: {
                'monitoring.users': {
                    userUid: monitorable.uid,
                    alias: monitorable.name,
                    active: true,
                    createdAt: ts,
                    selected: allowanceDto.selected,
                    lockedUpTo: 0
                }
            }
        });
    }

    addIot = async (deviceDto: deviceDto) => {

        await this._updateOne({
            _id: deviceDto.userUid
        }, {
            $push: {
                'monitoring.iots': {
                    deviceId: deviceDto.deviceId
                }
            }
        });
        
    }

    private _aggregate = async (query: any) => {
        return userSchema.aggregate(query);
    }

    private _updateOne = async (query: any, data: any) => {
        return userSchema.updateOne(query, data);
    }
}

export default monitoringAllowanceMongo;