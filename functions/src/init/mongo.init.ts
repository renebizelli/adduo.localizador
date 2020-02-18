import * as mongoose from 'mongoose';

import config from '../config/config';
import * as mongo from '../config/mongo.config.json';
import mongoConfigDto from '../dto/config/mongo-config.dto';

let env: string = config.env();
let mongoEnv = <mongoConfigDto>(<any>mongo)[env];

mongoose.connection.once('error', function (e) {
  console.log('Could not connect to the database. Exiting now...');
});

mongoose.connection.once('open', function () {
  console.log("Successfully connected to the database");
});

mongoose.connect(mongoEnv.connection, {
  useNewUrlParser: true
});


