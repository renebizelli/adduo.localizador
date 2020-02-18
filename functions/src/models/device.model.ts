import * as mongoose from 'mongoose';

interface deviceModel
    extends mongoose.Document {
    _id: any,
    userUid: string,
    alias: string,
    status: string,
    type: string,
    detail: any
}

export default deviceModel;