import * as mongoose from 'mongoose';
import productModel from './product.model';

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    data: mongoose.Schema.Types.Mixed
}, {
        _id: false
    })


export default mongoose.model<productModel & mongoose.Document>('product', schema);
