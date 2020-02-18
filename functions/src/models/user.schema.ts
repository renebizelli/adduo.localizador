import * as mongoose from 'mongoose';

import cultureEnum from '../enum/culture.enum';

import userModel from './user.model';
import platformEnum from '../enum/platform.enum';
import notificationEnum from '../enum/notification.enum';
import productEnum from '../enum/product.enum';
import subscriptionEnum  from '../enum/subscription.enum';

let userMonitoredSchema = new mongoose.Schema({
    userUid: {
        type: mongoose.Schema.Types.String,
        ref: 'user'
    },
    alias: mongoose.Schema.Types.String,
    active: mongoose.Schema.Types.Boolean,
    selected: mongoose.Schema.Types.Boolean,
    createdAt: mongoose.Schema.Types.Number,
    selectedAt: mongoose.Schema.Types.Number,
    lockedUpTo: mongoose.Schema.Types.Number
}, {
    _id: false
});

let userIotSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.String,
        ref: 'device'
    }
}, {
    _id: false
});

let userSubscriptionStatusProduct = new mongoose.Schema({
    sku: mongoose.Schema.Types.String,
    title: mongoose.Schema.Types.String,
    numberOfLicenses: mongoose.Schema.Types.Number,
    type: {
        type: mongoose.Schema.Types.String,
        enum: productEnum.types()
    }

}, {
    _id: false
})


let userSubscription = new mongoose.Schema({
    subscriptionId: mongoose.Schema.Types.String,
    active: mongoose.Schema.Types.Boolean,
    lastStatus: {
        type: mongoose.Schema.Types.Number,
        enum: subscriptionEnum.subscriptionStatus()
    },
    startTime: mongoose.Schema.Types.Number,
    expiryTime: mongoose.Schema.Types.Number,
    resumeTime: mongoose.Schema.Types.Number,
    product: userSubscriptionStatusProduct,
    isProcessing: mongoose.Schema.Types.Boolean
}, {
    _id: false
});

let userCurrentSmartphone = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'device',
            required: false
        },
        platform: {
            type: mongoose.Schema.Types.String,
            enum: platformEnum.platforms()
        }

    }
    , {
        _id: false
    });


let userCommunication = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.String,
        type: {
            type: mongoose.Schema.Types.String,
            enum: notificationEnum.types()
        },
        sendedAt: mongoose.Schema.Types.Number
    }, {
    _id: false
});


let schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    token: {
        push: mongoose.Schema.Types.String
    },
    session: {
        logged: mongoose.Schema.Types.Boolean,
        last_signin: mongoose.Schema.Types.Number
    },
    currentSmartphone: userCurrentSmartphone,
    monitoring: {
        allowed: [mongoose.Schema.Types.String],
        users: [userMonitoredSchema],
        iots: [userIotSchema]
    },
    subscription: userSubscription,
    contact: {
        email: mongoose.Schema.Types.String,
        cellPhone: mongoose.Schema.Types.String
    },
    info: {
        name: mongoose.Schema.Types.String,
        createdAt: mongoose.Schema.Types.Number,
        culture: {
            type: mongoose.Schema.Types.String,
            enum: cultureEnum.cultures()
        },
        vip: mongoose.Schema.Types.Boolean
    },
    weatherAlert: mongoose.Schema.Types.String,
    communications: [userCommunication]

}, {
    _id: false
});

export default mongoose.model<userModel>('user', schema);