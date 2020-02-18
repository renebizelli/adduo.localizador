import * as mongoose from 'mongoose';
import 'mongoose-geojson-schema';
import locationHistoryModel from './location-history.model';

var fenceSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.Point,
    coordinates: [mongoose.Schema.Types.Number]
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'device'
  },  
  fenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fence'
  },
  status: mongoose.Schema.Types.String,
  occurredAt: mongoose.Schema.Types.Number
}, {
    _id: false
  });

var locationSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.Point,
    coordinates: [mongoose.Schema.Types.Number]
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'device'
  },  
  altitude: mongoose.Schema.Types.Number,
  speed: mongoose.Schema.Types.Number,
  accuracy: mongoose.Schema.Types.Number,
  occurredAt: mongoose.Schema.Types.Number
}, {
    _id: false
  });

var schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.String,
    ref: 'user',
  },
  fence: [fenceSchema],
  location: [locationSchema]

}, {
    _id: false
  });

export default mongoose.model<locationHistoryModel>('locationHistory', schema);