import * as mongoose from 'mongoose';
import contentModel from './content.model';

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    data: mongoose.Schema.Types.Mixed
}, {
    _id: false
})


export default mongoose.model<contentModel & mongoose.Document>('content', schema);
