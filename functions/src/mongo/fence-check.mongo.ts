import baseMongo from './base.mongo';
import fenceSchema from '../models/fence.schema';
import locationDto from '../dto/location.dto';
import modelToDtoParser from '../parsers/model-to-dto.parser';
import fenceCheckResultDto from '../dto/fence-check-result.dto';
import fenceCheckDto from '../dto/fence-check.dto';

class fenceCheckMongo extends baseMongo {

    check = async (locationDto: locationDto): Promise<fenceCheckResultDto[]> => {

        let query = [{
            "$geoNear": {
                "query": {
                    "monitored.uid": locationDto.uid,
                    "active": true
                },
                "near": {
                    "type": "Point",
                    coordinates: [locationDto.location.lat, locationDto.location.lng]
                },
                "distanceField": "dist.calculated",
                "spherical": true
            }
        },
        {
            "$lookup": {
                "from": "users",
                "let": {
                    "fenceOwnerUid": "$userUid"
                },
                "pipeline": [{
                    "$match": {
                        "$expr": {
                            "$and": [{
                                "$eq": [
                                    "$_id",
                                    "$$fenceOwnerUid"
                                ]
                            },
                            {
                                "$eq": [
                                    "$session.logged",
                                    true
                                ]
                            },
                            {
                                "$eq": [
                                    "$subscription.active",
                                    true
                                ]
                            }
                            ]
                        }
                    }
                },
                {
                    "$project": {
                        "info": 1,
                        "monitoring.users": {
                            "$filter": {
                                "input": "$monitoring.users",
                                "as": "monitorable",
                                "cond": {
                                    "$and": [{
                                        "$eq": ["$$monitorable.userUid", locationDto.uid]
                                    },
                                    {
                                        "$eq": ["$$monitorable.active", true]
                                    },
                                    {
                                        "$eq": ["$$monitorable.selected", true]
                                    }
                                    ]
                                }
                            }
                        }
                    }
                }
                ],
                "as": "owner"
            }
        },
        {
            "$unwind": "$owner"
        },
        {
            "$unwind": "$owner.monitoring.users"
        },
        {
            "$unwind": "$monitored"
        },
        {
            "$match": {
                "monitored.uid": locationDto.uid
            }
        },
        {
            "$project": {
                "monitored": "$monitored",
                "radius": 1,
                "priority": 1,
                "title": 1,
                "userUid": 1,
                "distance": "$dist.calculated",
                "alias": "$owner.monitoring.users.alias",
                "culture": "$owner.info.culture"
            }
        }];

        let fences = await this._aggregate(query);

        let result = modelToDtoParser.fenceCheck(fences);

        return result;

    }

    monitoredStatusUpdate = async (dto: fenceCheckDto) => {

        return this._update({
            _id: dto.fenceId
        }, {
                $set: {
                    'monitored.$[elem].status': dto.status,
                    'monitored.$[elem].updatedAt': dto.occurredAt
                }
            }, {
                arrayFilters: [
                    {
                        "elem.uid": dto.monitorableUid
                    }
                ]
            });

    }

    private _update(query: any, data: any, options?: any) {

        let _options = {
            multi: true
        }

        Object.assign(_options, options);

        return fenceSchema.update(query, data, _options);
    }



    private _aggregate = async (query: any) => {
        return fenceSchema.aggregate(query);
    }



}

export default fenceCheckMongo;