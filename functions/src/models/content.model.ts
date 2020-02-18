import * as mongoose from 'mongoose';

interface contentModel
    extends mongoose.Document {
    _id: string,
    data: any
}

export default contentModel
