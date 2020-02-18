import fenceSchema from "../models/fence.schema";
import * as mongoose from 'mongoose';
import fenceDto from "../dto/fence.dto";

import timeStampHelper from "../helpers/timestamp.helper";

import dtoToModelParser from "../parsers/dto-to-model.parser";
import modelToDtoParser from "../parsers/model-to-dto.parser";
import baseMongo from "./base.mongo";

class fenceMongo extends baseMongo {

    create = async (fenceDto: fenceDto) => {

        let fenceModel = dtoToModelParser.fence(fenceDto);

        let ts = timeStampHelper.get();

        fenceModel.createdAt = ts;

        let fence = await (new fenceSchema(fenceModel)).save();

        let dto = modelToDtoParser.fenceList(fence);

        return dto;
    }

    update = async (fenceDto: fenceDto) => {

        let model = dtoToModelParser.fence(fenceDto);

        let currentFence = await this._findOne({ _id: fenceDto._id }, { monitored: 1 });

        if (currentFence && currentFence.monitored.length) {

            for (let i = 0; i < model.monitored.length; i++) {

                let currentStatus = currentFence.monitored.filter(f => {
                    return f.uid == model.monitored[i].uid
                })

                if (currentStatus.length) {
                    model.monitored[i] = currentStatus[0];
                }
            }
        }

        return this._updateOne({ _id: fenceDto._id, userUid: fenceDto.userUid }, model);
    }

    delete = async (fenceId: string, uid: string) => {
        return this._updateOne({ _id: fenceId, userUid: uid }, { active: false });
    }

    removeUser = async (uid: string, monitoredUid: string) => {

        return this._update({
            userUid: uid
        }, {
                $pull: {
                    monitored: {
                        uid: {
                            $in: [monitoredUid]
                        }
                    }
                }
            });

    }


    one = async (fenceId: string, uid: string) => {

        let query = [{
            $match: {
                _id: new mongoose.Types.ObjectId(fenceId),
                active: true,
                userUid: uid
            }
        },
        {
            $lookup: {
                from: 'users',
                let: {
                    allowedUserUid: '$userUid',
                    monitored: '$monitored'
                },
                pipeline: [{
                    $unwind: '$monitoring.users'
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$monitoring.users.active", true]
                            }, {
                                $eq: ["$_id", "$$allowedUserUid"]
                            }, {
                                $in: ["$monitoring.users.userUid", "$$monitored.uid"]
                            }]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'monitoring.users.userUid',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userUid: '$monitoring.users.userUid',
                        alias: '$monitoring.users.alias',
                        status: { $arrayElemAt: ["$$monitored.status", 0] },
                        contact: {
                            $ifNull: [{
                                $arrayElemAt: ["$user.contact", 0]
                            }, {
                                email: '',
                                cellPhone: ''
                            }]
                        }
                    }
                },
                ],
                as: 'monitored'
            }
        },
        {
            $project: {
                radius: 1,
                location: 1,
                address: 1,
                priority: 1,
                title: 1,
                createdAt: 1,
                userUid: 1,
                "lat": {
                    $arrayElemAt: ["$location.coordinates", 0]
                },
                "lng": {
                    $arrayElemAt: ["$location.coordinates", 1]
                },
                monitored: 1
            }
        }];

        let model = await this._aggregate(query);

        if (model.length) {
            return modelToDtoParser.fenceOne(model[0]);
        }

        return;
    }

    all = async (uid: string) => {

        let query = [{
            $match: {
                active: true,
                userUid: uid
            }
        },
        {
            $project: {
                radius: 1,
                address: 1,
                priority: 1,
                title: 1,
                location: 1,
                monitored: 1,
                createdAt: 1
            }
        }];

        let fences = await this._aggregate(query);

        let dtos = [];

        for (let fence of fences) {
            dtos.push(modelToDtoParser.fenceList(fence))
        }

        return dtos;
    }


    private _updateOne = async (query: any, data: any) => {
        return fenceSchema.updateOne(query, data);
    }

    private _update = async (query: any, data: any) => {
        return fenceSchema.updateMany(query, data, { multi: true });
    }


    private _findOne = async (query: any, projection?: any) => {
        return fenceSchema.findOne(query, projection);
    }

    private _aggregate = async (query: any) => {
        return fenceSchema.aggregate(query);
    }



}

export default fenceMongo;