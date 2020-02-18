import baseMongo from './base.mongo';
import userSchema from '../models/user.schema';

class monitoringMongo extends baseMongo {

    protected _selectedMany = async (uid: string) => {

        let query = [{
            $match: {
                _id: uid
            }
        },
        {
            $unwind: '$monitoring.users'
        },
        {
            $match: {
                'monitoring.users.selected': true,
                'monitoring.users.active': true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'monitoring.users.userUid',
                foreignField: '_id',
                as: 'monitored'
            }
        },
        {
            $project: {
                'product': 'subscription',
                '_id': 0,
                'userUid': '$monitoring.users.userUid',
                'alias': '$monitoring.users.alias',
                'selected': { $ifNull: ['$monitoring.users.selected', false] },
                'deviceId': {
                    $arrayElemAt: ["$monitored.currentSmartphone.deviceId", 0]
                },
                'platform': {
                    $arrayElemAt: ["$monitored.currentSmartphone.platform", 0]
                },
                'lockedUpTo': { $ifNull: ['$monitoring.users.lockedUpTo', 0] },
                "contact": {
                    $ifNull: [
                        { $arrayElemAt: ["$monitored.contact", 0] }
                        , {
                            email: '',
                            cellPhone: ''
                        }]
                }
            }
        }];

        return this._aggregate(query);

    }

    protected _unselectedMany = async (uid: string) => {

        let query = [{
            $match: {
                _id: uid
            }
        },
        {
            $unwind: '$monitoring.users'
        },
        {
            $match: {
                'monitoring.users.active': true,
                'monitoring.users.selected': false
            }
        },
        {
            $project: {
                '_id': 0,
                'userUid': '$monitoring.users.userUid',
                'alias': '$monitoring.users.alias',
            }
        }];

        return this._aggregate(query);

    }

    protected _aggregate = async (query: any) => {
        return userSchema.aggregate(query);
    }

    protected _update = async (query: any, data: any, options?: any) => {

        let _options = {
            multi: true
        }

        Object.assign(_options, options);

        return userSchema.update(query, data, _options);
    }


}

export default monitoringMongo;