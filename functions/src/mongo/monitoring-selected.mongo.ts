import monitoringMongo from './monitoring.mongo';
import monitoringSelectedDto from '../dto/monitoring-selected.dto';
import modelToDtoParser from '../parsers/model-to-dto.parser';

class monitoringSelectedMongo extends monitoringMongo {

    toMapMany = async (uid: string) => {

        let models = await this._selectedMany(uid)

        let dtos = []

        for (let model of models) {
            let dto = modelToDtoParser.selectedToMap(model);
            dtos.push(dto);
        }

        return dtos;
    }

    toAccountMany = async (uid: string) => {

        let models = await this._selectedMany(uid)

        let dtos = []

        for (let model of models) {
            let dto = modelToDtoParser.selectedToAccount(model);
            dtos.push(dto);
        }

        return dtos;
    }


    checkSelectedQuantity = async (uid: string) => {

        let query = [
            {
                '$match': {
                    '_id': uid
                }
            },
            {
                '$project': {
                    'sku': '$subscription.product.sku',
                    'numberOfLicenses': '$subscription.product.numberOfLicenses',
                    'usedLicenses': {
                        '$size': {
                            '$filter': {
                                'input': '$monitoring.users',
                                'cond': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$$this.selected',
                                                true]
                                        },
                                        {
                                            '$eq': [
                                                '$$this.active',
                                                true]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]

        let result = await this._aggregate(query);

        return modelToDtoParser.checkSelectedQuantityDto(result[0]);
    }

    save = async (selectedDto: monitoringSelectedDto) => {

        return this._update({
            _id: selectedDto.allowedUid
        }, {
            $set: {
                'monitoring.users.$[elem].selected': true,
                'monitoring.users.$[elem].selectedAt': selectedDto.selectedAt,
                'monitoring.users.$[elem].lockedUpTo': selectedDto.lockedUpTo,
            }
        },
            {
                arrayFilters: [{
                    "elem.userUid": selectedDto.monitorableUid
                }]
            });

    }

    delete = async (dto: monitoringSelectedDto) => {

        return this._update({
            _id: dto.allowedUid
        }, {
            $set: {
                'monitoring.users.$[elem].selected': false
            }
        },
            {
                arrayFilters: [{
                    "elem.userUid": dto.monitorableUid
                }]
            });

    }

}

export default monitoringSelectedMongo;