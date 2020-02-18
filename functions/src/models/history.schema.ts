import * as mongoose from 'mongoose';
import historyModel from './history.model';

var itemSchema = new mongoose.Schema({
    type: mongoose.Schema.Types.String,
    action: mongoose.Schema.Types.String,
    targetId: mongoose.Schema.Types.String,
    afterObject: mongoose.Schema.Types.Mixed,
    occurredAt: mongoose.Schema.Types.Number
}, { _id: false });

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    items: [itemSchema]
});

export default mongoose.model<historyModel>('history', schema);
