import * as mongoose from 'mongoose';

var externalTokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    token: mongoose.Schema.Types.Mixed
}, {
    _id: false,
    timestamps: false
});

module.exports = mongoose.model('externalToken', externalTokenSchema);