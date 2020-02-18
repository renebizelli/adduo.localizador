import { receiptStatusString } from "../enum/subscription.enum";
import * as mongoose from 'mongoose';
import { platformsString } from "../enum/platform.enum";

interface subscriptionReceiptModel extends mongoose.Document {
    _id: {
        uid: string,
        transactionId: string
    },
    platform: platformsString,
    receipt: string,
    status: receiptStatusString,
    tryToSend: number,
    error: [any],
    createdAt: number


}

export default subscriptionReceiptModel;