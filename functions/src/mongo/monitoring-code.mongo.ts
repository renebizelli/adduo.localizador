
import monitoringCodeDto from "../dto/monitoring-code.dto";
import timeStampHelper from "../helpers/timestamp.helper";
import monitoringCodeSchema from "../models/monitoring-code.schema";
import modelToDtoParser from "../parsers/model-to-dto.parser";

class monitoringCodeMongo {

    create = async (codeDto: monitoringCodeDto) => {

        // ##transaction

        let ts = timeStampHelper.get();

        await (new monitoringCodeSchema({
            _id: codeDto.code,
            userUid: codeDto.uid,
            active: true,
            createdAt: ts,
            finishedAt: 0
        })).save();

        await this._updateMany({
            userUid: codeDto.uid,
            active: true,
            _id: {
                $ne: codeDto.code
            }
        }, {
                finishedAt: ts,
                active: false
            });

    }

    ownerOne = async (code: string) => {

        let query = [{
            $match: {
                _id: code.toUpperCase(),
                active: true
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userUid',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $project: {
                _id: 1,
                userUid: 1,
                culture: {
                    $arrayElemAt: ["$user.info.culture", 0]
                },
                name: { $arrayElemAt: ["$user.info.name", 0] },
                productId: { $arrayElemAt: ["$user.subscription.product.sku", 0] },
                subscriptionStatus: { $arrayElemAt: ["$user.subscription.lastStatus", 0] }
            }
        }
        ];

        let codeModel = await this._aggregate(query);

        let codeDto = null;

        if (codeModel.length) {
            codeDto = modelToDtoParser.monitoringAllowance(codeModel[0]);
        }

        return codeDto;
    }


    one = async (uid: string) => {

        let codeModel = await this._one({ userUid: uid, active: true }, { _id: 1 });

        let codeDto = null;

        if (codeModel) {
            codeDto = modelToDtoParser.monitoringCode(codeModel);
        }

        return codeDto;
    }

    private _aggregate = async (query: any) => {
        return monitoringCodeSchema.aggregate(query);
    }

    private _one = async (query: any, projection?: any) => {
        return monitoringCodeSchema.findOne(query, projection);
    }

    private _updateMany = async (query: any, data: any, options?: any) => {

        let _options = {
            multi: true
        }

        Object.assign(_options, options);

        return monitoringCodeSchema.updateMany(query, data, _options);
    }

}

export default monitoringCodeMongo;