import * as mongoose from 'mongoose';
import 'mongoose-geojson-schema';

import weatherAlertModel from './weather-alert.model';

var schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    expires: mongoose.Schema.Types.Number,
    instruction: [mongoose.Schema.Types.String],
    description: mongoose.Schema.Types.String,
    event: mongoose.Schema.Types.String,
    urgency: mongoose.Schema.Types.String,
    severity: mongoose.Schema.Types.String,
    sender: mongoose.Schema.Types.String,
    code: mongoose.Schema.Types.String,
    createdAt: mongoose.Schema.Types.Number,
    polygon: {
        type: { type: String, default: mongoose.Schema.Types.Polygon },
        coordinates: [[[mongoose.Schema.Types.Number]]]
    }
}, {
        _id: false,
        timestamps: false
    })

schema.index({
    polygon: "2dsphere"
});

export default mongoose.model<weatherAlertModel>('weather-alert', schema);
