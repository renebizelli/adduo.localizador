
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import * as services from '../config/google-services.json';
import * as cert from '../config/google-cert.json';

let env = 'nextter-production';

console.log("-------------------------------------------------------")
console.log('Ambiente', env)
console.log("-------------------------------------------------------")

let certEnv = (<any>cert)[env];
let serviceEnv = (<any>services)[env];

const params = {
    type: certEnv.type,
    projectId: certEnv.project_id,
    privateKeyId: certEnv.private_key_id,
    privateKey: certEnv.private_key,
    clientEmail: certEnv.client_email,
    clientId: certEnv.client_id,
    authUri: certEnv.auth_uri,
    tokenUri: certEnv.token_uri,
    authProviderX509CertUrl: certEnv.auth_provider_x509_cert_url,
    clientC509CertUrl: certEnv.client_x509_cert_url
}

firebase.initializeApp(serviceEnv);

admin.initializeApp({
    credential: admin.credential.cert(params),
    databaseURL: 'https://' + serviceEnv.databaseURL
});

import * as mongoose from 'mongoose';

import * as mongo from '../config/mongo.config.json';
import mongoConfigDto from '../dto/config/mongo-config.dto';

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
