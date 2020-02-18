import userSchema from "../models/user.schema";

import userDto from "../dto/user.dto";

import timeStampHelper from "../helpers/timestamp.helper";

import setupDto from "../dto/setup.dto";
import modelToDtoParser from "../parsers/model-to-dto.parser";
import userRefreshTokenDto from "../dto/user-refresh-token.dto";
import baseMongo from "./base.mongo";
import { platformsString } from "../enum/platform.enum";
import communicationDto from "../dto/communication.dto";

class userMongo extends baseMongo {

    save = async (user: userDto) => {

        let ts = timeStampHelper.get();

        let newuser =
        {
            $set: {
                info: {
                    name: user.name,
                    createdAt: user.createdAt,
                    culture: user.culture,
                    vip: false
                },
                contact: {
                    email: user.email || '',
                    cellPhone: user.phone || ''
                },
                session: {
                    logged: false,
                    last_signin: ts
                },
                token: {
                    push: ''
                },
                currentSmartphone: {
                    platform: platformsString.none
                },
                monitoring: {
                    allowed: [],
                    users: [],
                    iots: []
                },
                weatherAlert: ''
            }
        };

        return this._updateOne({ _id: user.uid }, newuser, { upsert: true });
    }

    delete = async (uid: string) => {
        return this._deleteOne(uid);
    }

    sessionByUid = async (uid: string) => {
        return this._findById(uid, { session: 1 })
    }

    pushTokenOne = async (uid: string) => {

        let model = await this._findById(uid, { currentSmartphone: 1, "token.push": 1 })

        if (model) {
            return modelToDtoParser.userPushToken(model)
        }

        return null;
    }

    basicOne = async (uid: string) => {

        let query = [
            {
                $match: { _id: uid }
            },
            {
                $project: {
                    _id: 1,
                    name: "$info.name",
                    culture: "$info.culture",
                    platform: "$currentSmartphone.platform",
                    email: "$contact.email",
                    phone: "$contact.phone",
                    subscription: "$subscription.lastStatus",
                    createdAt: "$info.createdAt"
                }
            }
        ]

        let model = await this._aggregate(query)

        if (model.length) {
            return modelToDtoParser.userDto(model[0])
        }

        return null;
    }

    cultureUpdate = async (uid: string, culture: string) => {
        return this._updateOne({ _id: uid }, {
            "info.culture": culture
        });
    }

    communicationSendedAdd = async (communication: communicationDto) => {

        return this._updateOne({ _id: communication.uid }, {
            $push: {
                "communications": {
                    _id: communication.communicationId,
                    sendedAt: communication.sendedAt,
                    type: communication.type

                }
            }
        });

    }

    update = async (uid: string, userDto: userDto) => {
        return this._updateOne({ _id: uid }, {
            "info.culture": userDto.culture,
            "info.name": userDto.name,
            "contact.email": userDto.email,
            "contact.cellPhone": userDto.phone,
        });
    }

    weatherAlertInsideUpdate = async (uid: string, weatherAlertId: string) => {
        return this._weatherAlertUpdate(uid, weatherAlertId)
    }

    weatherAlertOutsideUpdate = async (uid: string) => {
        return this._weatherAlertUpdate(uid)
    }

    private _weatherAlertUpdate = async (uid: string, weatherAlertId?: string) => {
        return this._updateOne({ _id: uid }, {
            $set: { "weatherAlert": weatherAlertId }
        });
    }

    weatherAlertOne = async (uid: string) => {
        let model = await this._findById(uid, { "weatherAlert": 1 });

        if (model && model.weatherAlert) {
            return modelToDtoParser.userWeatherAlert(model)
        }

        return;
    }

    setup = async (setup: setupDto) => {

        return this._updateOne({
            _id: setup.uid
        }, {
            currentSmartphone: {
                deviceId: setup.deviceId,
                platform: setup.platform
            },
            session: {
                last_signin: setup.ts,
                logged: true
            }
        });

    }

    exist = async (uid: string): Promise<boolean> => {

        let user = await this._findById(uid, { _id: 1 });

        return user != null;
    }

    refreshToken = async (tokenDto: userRefreshTokenDto) => {
        return this._updateOne({ _id: tokenDto.uid }, { $set: { "token.push": tokenDto.token } });
    }

    logout = async (uid: string) => {
        return this._updateOne({ _id: uid }, { $set: { "token.push": '', "session.logged": false } });
    }

    private _findById = async (uid: string, projection?: any) => {
        return userSchema.findById(uid, projection);
    }

    private _updateOne = async (query: any, data: any, options?: any) => {

        let _options = {
            multi: true
        }

        Object.assign(_options, options);

        return userSchema.updateOne(query, data, _options);

    }

    protected _aggregate = async (query: any) => {
        return userSchema.aggregate(query);
    }

    private _deleteOne = async (uid: string) => {
        return userSchema.deleteOne({ _id: uid });
    }




}

export default userMongo;