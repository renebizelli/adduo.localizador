import * as mongoose from 'mongoose';
import logModel from './log.model';
import historyEnum from '../enum/history.enum';

var schema = new mongoose.Schema({
    userUid: {
        type: mongoose.Schema.Types.String,
        ref: 'user'
    },
    function: mongoose.Schema.Types.String,
    params: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    idType: mongoose.Schema.Types.String,
    type: {
        type: mongoose.Schema.Types.String,
        enum: historyEnum.types()
    },
    message: mongoose.Schema.Types.String,
    stack: mongoose.Schema.Types.String,
    headers: mongoose.Schema.Types.Mixed,
    endpoint: {
        url: mongoose.Schema.Types.String,
        method: mongoose.Schema.Types.String
    }
}, {
    timestamps: true
});

export default mongoose.model<logModel & mongoose.Document>('log', schema);
