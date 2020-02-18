import baseMongo from "./base.mongo";
import userSchema from '../models/user.schema';
import modelToDtoParser from "../parsers/model-to-dto.parser";
import subscriptionUpdateDto from "../dto/subscription-update.dto";
import countdownFreeUserParams from "../query-params/countdown-free-user.params";
import { subscriptionStatusString } from "../enum/subscription.enum";
import timeStampHelper from "../helpers/timestamp.helper";

class subscriptionMongo extends baseMongo {

    clearSelected = async (uid: String) => {

        return this._updateOne({
            _id: uid
        }, {
            $set: {
                'monitoring.users.$[].selected': false,
                'monitoring.users.$[].lockedUpTo': 0,
                'monitoring.users.$[].selectedAt': 0
            }
        });

    }

    selectedAll = async (uid: String) => {

        return this._updateOne({
            _id: uid
        }, {
            $set: {
                'monitoring.users.$[].selected': true,
                'monitoring.users.$[].lockedUpTo': 0,
                'monitoring.users.$[].selectedAt': 0
            }
        });

    }


    update = async (updateDto: subscriptionUpdateDto) => {

        return this._updateOne({
            _id: updateDto.uid
        }, {
            $set: {
                'subscription': {
                    subscriptionId: updateDto.subscriptionId,
                    active: updateDto.active,
                    lastStatus: updateDto.lastStatus,
                    startTime: updateDto.startTime,
                    expiryTime: updateDto.expiryTime,
                    resumeTime: updateDto.resumeTime,
                    isProcessing: false,
                    product: {
                        sku: updateDto.product.sku,
                        title: updateDto.product.title,
                        numberOfLicenses: updateDto.product.numberOfLicenses,
                        type: updateDto.product.type
                    }
                }
            }
        });

    }

    blockedOverdueUser = async (uid: string) => {

        return this._updateOne({
            _id: uid
        }, {
            $set: {
                'subscription.active': false,
                'subscription.lastStatus': subscriptionStatusString.active,
            }
        });

    }


    overdueMany = async (today: number) => {

        let query = [
            {
                $match: {
                    'info.vip': false,
                    'subscription.active': true,
                    'subscription.expiryTime': { $lt: today }
                },
            },
            {
                $project: {
                    name: "$info.name",
                    platform: "$currentSmartphone.platform",
                    culture: "$info.culture",
                    email: "$contact.email",
                    phone: "$contact.cellPhone"
                }
            }
        ];

        let results = await this._aggregate(query);

        let dtos = [];

        for (let result of results) {
            dtos.push(modelToDtoParser.userDto(result));
        }

        return dtos
    }

    countdownFreeUserMany = async (params: countdownFreeUserParams) => {

        let query = [
            {
                $match: {
                    "communications._id": { $nin: [params.communicationId] },
                    "subscription.product.sku": params.freeSkuProduct,
                    "subscription.active": true
                }
            },
            {
                $project: {
                    "daysLeft":
                    {
                        $floor: {
                            $divide:
                                [
                                    {
                                        $subtract:
                                            ["$subscription.expiryTime", params.ts]
                                    }, params.constantDay
                                ]
                        }
                    },
                    "name": "$info.name",
                    "platform": "$currentSmartphone.platform",
                    "culture": "$info.culture",
                    "email": "$contact.email",
                    "phone": "$contact.cellPhone"
                }
            },
            {
                $match: {
                    "daysLeft": { $eq: params.daysTarget }
                }
            }

        ];

        let results = await this._aggregate(query);

        let dtos = [];

        for (let result of results) {
            dtos.push(modelToDtoParser.userDto(result));
        }

        return dtos
    }

    one = async (uid: string) => {

        let ts = timeStampHelper.get();
        let constantDay = timeStampHelper.oneDay();

        let query = [
            {
                $match: { _id: uid }
            },
            {
                $project: {
                    "daysLeft":
                    {
                        $floor: {
                            $divide:
                                [
                                    {
                                        $subtract:
                                            ["$subscription.expiryTime", ts]
                                    }, constantDay
                                ]
                        }
                    },
                    "statusEnum": {
                        $ifNull: ["$subscription.lastStatus", "1"]
                    },
                    "sku": "$subscription.product.sku",
                    "active": "$subscription.active",
                    "numberOfLicenses": "$subscription.product.numberOfLicenses",
                    "title": "$subscription.product.title",
                    "type": "$subscription.product.type",
                    "expiryTime": "$subscription.expiryTime",
                    "isProcessing": {
                        $ifNull: ["$subscription.isProcessing", false]
                    }
                }
            }
        ];

        let results = await this._aggregate(query);

        let dto = modelToDtoParser.subscriptionSummary(results[0]);

        return dto;
    }

    markProcessing = async (uid: string) => {

        return this._updateOne({
            _id: uid
        }, {
            $set: {
                'subscription.isProcessing': true
            }
        });

    }


    private _updateOne(query: any, data: any, options?: any) {

        let _options = {
            multi: true
        };
        Object.assign(_options, options);


        return userSchema.updateOne(query, data, _options);
    }

    private _aggregate = async (query: any) => {
        return userSchema.aggregate(query);
    }

}

export default subscriptionMongo;