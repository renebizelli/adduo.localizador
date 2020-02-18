import * as mongoose from 'mongoose';
import { notificationTypesString } from '../enum/notification.enum';
import { productTypesString } from '../enum/product.enum';

interface userModel
    extends mongoose.Document {
    _id: any,
    token: userTokenModel,
    session: userSessionModel,
    iots: string[],
    currentSmartphone: userCurrentSmartphoneModel,
    monitoring: userMonitoringModel,
    subscription: userSubscriptionModel,
    communications: userCommunicationModel[],
    contact: userContactModel,
    info: userInfoModel,
    weatherAlert: string
}

export interface userCurrentSmartphoneModel {
    deviceId: string,
    platform: string
}


export interface userSessionModel {
    logged: boolean,
    last_signin: number
}

export interface userContactModel {
    email: string,
    cellPhone: string
}

export interface userInfoModel {
    name: string,
    createdAt: number,
    culture: string,
    vip: boolean
}

export interface userTokenModel {
    push: string
}

export interface userMonitoringModel {
    users: userMonitoringMonitorableModel[],
    allowed: string[],
    iots: userMonitoringIotModel[]
}

export interface userMonitoringMonitorableModel {
    userUid: string,
    alias: string,
    active: boolean,
    selected: boolean,
    createdAt: number,
    selectedAt: number,
    lockedUpTo: number
}

export interface userMonitoringIotModel {
    deviceId: string
}

export interface userSubscriptionModel {
    uid: string,
    subscriptionId: string,
    active: boolean,
    lastStatus: number,
    startTime: number,
    expiryTime: number,
    resumeTime: number,
    isProcessing: boolean,
    product: userSubscriptionProductModel
}

export interface userSubscriptionReceiptModel {
    _id: string,
    data: any
}

export interface userSubscriptionProductModel {
    sku: string,
    title: string,
    numberOfLicenses: number,
    type: productTypesString
}

export interface userCommunicationModel {
    _id: string,
    type: notificationTypesString.none,
    sendedAt: number
}


export default userModel;