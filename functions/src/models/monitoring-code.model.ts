import * as mongoose from 'mongoose';

interface monitoringCodeModel
    extends mongoose.Document {
    _id: string,
    userUid: string,
    active: boolean,
    createdAt: Date,
    finishedAt: Date
}

export default monitoringCodeModel;