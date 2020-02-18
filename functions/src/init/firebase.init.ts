
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';

import config from '../config/config';
import * as services from '../config/google-services.json';
import * as cert from '../config/google-cert.json';

let env: string = config.env();
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
