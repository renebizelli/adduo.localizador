import * as mongoose from 'mongoose';
import constantModel from './constant.model';

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    data: mongoose.Schema.Types.Mixed
}, {
        _id: false
    })


export default mongoose.model<constantModel & mongoose.Document>('constant', schema);
