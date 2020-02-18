import * as mongoose from 'mongoose';
import monitoringCodeModel from './monitoring-code.model';

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    userUid: {
        type: mongoose.Schema.Types.String,
        ref: 'user'
    },
    active: mongoose.Schema.Types.Boolean,
    createdAt: mongoose.Schema.Types.Date,
    finishedAt: mongoose.Schema.Types.Date,
}, { _id: false });

export default mongoose.model<monitoringCodeModel>('monitoringCode', schema);
