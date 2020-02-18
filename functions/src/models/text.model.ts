import * as mongoose from 'mongoose';

interface textModel
    extends mongoose.Document {

    _id: string,
    pt: string

}

export default textModel;