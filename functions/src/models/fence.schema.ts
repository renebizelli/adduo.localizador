import * as mongoose from 'mongoose';
import 'mongoose-geojson-schema';
import fenceModel from './fence.model';
import fenceEnum from '../enum/fence.enum';


var monitoredSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    createdAt: mongoose.Schema.Types.Number,
    updatedAt: mongoose.Schema.Types.Number,
    status: {
        type: mongoose.Schema.Types.String,
        enum: fenceEnum.status()
    }
}, {
        _id: false
    });

var fenceSchema = new mongoose.Schema({

    location: {
        type: mongoose.Schema.Types.Point,
        coordinates: [mongoose.Schema.Types.Number]
    },
    radius: mongoose.Schema.Types.Number,
    priority: mongoose.Schema.Types.Number,
    monitored: [monitoredSchema],
    userUid: {
        type: mongoose.Schema.Types.String,
        ref: 'user'
    },
    address: mongoose.Schema.Types.String,
    title: mongoose.Schema.Types.String,
    active: mongoose.Schema.Types.Boolean,
    createdAt: mongoose.Schema.Types.Number
});

fenceSchema.index({
    location: "2dsphere"
});

export default mongoose.model<fenceModel>('fence', fenceSchema);