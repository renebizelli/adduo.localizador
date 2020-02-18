import * as mongoose from 'mongoose';

interface constantModel
    extends mongoose.Document {
    _id: string,
    data: any
}

export default constantModel
