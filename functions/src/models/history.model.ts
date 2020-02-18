import * as mongoose from 'mongoose';

interface historyModel
    extends mongoose.Document {
    _id: string
    items:historyItemModel[]
}

export interface historyItemModel {
    type: string,
    action: string,
    targetId: string,
    afterObject: any,
    occurredAt: number
}

export default historyModel;