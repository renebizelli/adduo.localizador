import * as mongoose from 'mongoose';

import deviceEnum from '../enum/device.enum';

import deviceModel from './device.model';

var schema = new mongoose.Schema({
    userUid: {
        type: mongoose.Schema.Types.String,
        ref: 'user'
    },
    alias: mongoose.Schema.Types.String,
    status: {
        type: mongoose.Schema.Types.String,
        enum: deviceEnum.status()
    },
    type: {
        type: mongoose.Schema.Types.String,
        enum: deviceEnum.types()
    },
    detail: mongoose.Schema.Types.Mixed
} );

export default mongoose.model<deviceModel>('device', schema);



