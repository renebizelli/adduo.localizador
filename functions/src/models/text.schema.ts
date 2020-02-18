import * as mongoose from 'mongoose';
import textModel from './text.model';

let schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    pt: mongoose.Schema.Types.String
}, { _id: false });

export default mongoose.model<textModel>('text', schema);
