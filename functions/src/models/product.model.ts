import * as mongoose from 'mongoose';

interface productModel
    extends mongoose.Document {
    id: string,
    data: any
}

export default productModel
