import * as mongoose from 'mongoose';
import subscriptionEnum from '../enum/subscription.enum';
import subscriptionReceiptModel from './subscription-receipt.model';
import platformEnum from '../enum/platform.enum';

var schema = new mongoose.Schema({
    _id: {
        uid: mongoose.Schema.Types.String,
        transactionId: mongoose.Schema.Types.String
    },
    receipt: mongoose.Schema.Types.Mixed,
    platform: {
        type: mongoose.Schema.Types.String,
        enum: platformEnum.platforms(),
    },
    status: {
        type: mongoose.Schema.Types.String,
        enum: subscriptionEnum.receiptStatus()
    },
    tryToSend: mongoose.Schema.Types.Number,
    error: [mongoose.Schema.Types.Mixed],
    createdAt : mongoose.Schema.Types.Number

}, {
    _id: false
});


export default mongoose.model<subscriptionReceiptModel>('subscription-receipt', schema);