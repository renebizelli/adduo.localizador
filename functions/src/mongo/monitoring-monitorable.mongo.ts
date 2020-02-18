import monitoringMonitorableDto from '../dto/monitoring-monitorable.dto';
import monitoringMongo from './monitoring.mongo';
import modelToDtoParser from '../parsers/model-to-dto.parser';

class monitoringMonitorableMongo extends monitoringMongo {

    one = async (allowedUid: string, monitorableUid: string) => {

        let query = [{
            $match: {
                _id: allowedUid,
                'monitoring.users': {
                    $elemMatch: {
                        active: true,
                        userUid: monitorableUid,
                    }
                }
            }
        },
        {
            $unwind: '$monitoring.users'
        },
        {
            $match: {
                'monitoring.users.userUid': monitorableUid,
                'monitoring.users.active': true
            }
        },
        {
            $project: {
                'monitoring.users': 1
            }
        }
        ];

        let result = await this._aggregate(query);

        return result.length ? result[0] : null;
    }

    unselectedMany = async (uid: string) => {

        let models = await this._unselectedMany(uid)

        let dtos = []

        for (let model of models) {
            let dto = modelToDtoParser.unselected(model);
            dtos.push(dto);
        }

        return dtos;
    }

    update = async (monitorable: monitoringMonitorableDto) => {

        return this._update({
            _id: monitorable.uid
        }, {
                $set: {
                    'monitoring.users.$[elem].alias': monitorable.alias
                }
            }, {

                arrayFilters: [{
                    "elem.userUid": monitorable.monitorableUid,
                    "elem.active": true,

                }]
            });

    }

    delete = async (uid: string, monitorableUid: string) => {

        await this._update({
            _id: monitorableUid
        }, {
                $pull: {
                    'monitoring.allowed': uid,
                }
            });

        await this._update({
            _id: uid
        }, {
                $set: {
                    'monitoring.users.$[elem].active': false,
                    'monitoring.users.$[elem].selected': false
                }
            },
            {
                arrayFilters: [{
                    "elem.userUid": monitorableUid,
                    "elem.active": true,
                }]
            });

    }
}

export default monitoringMonitorableMongo;