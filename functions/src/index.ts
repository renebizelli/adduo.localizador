import * as functions from 'firebase-functions';

import mainApplication from './applications/main.application';
import './interfaces/request';
import './interfaces/global';
import './init/config.init';
import './init/firebase.init';
import './init/mongo.init';

let main: mainApplication = new mainApplication();

console.log("-------------------------------------------------------")
console.log('Version', global.config.version)
console.log("-------------------------------------------------------")

let app = functions.https.onRequest(main.getApp());

import * as locationDeleteTrigger from './triggers/location-delete.trigger';
import * as fenceCheckTrigger from './triggers/fence-check.trigger';
import * as pushTrigger from './triggers/push.trigger';
import * as subscriptionReceiptSendToAdmin from './triggers/subscription-receipt-send-to-admin.trigger';
import * as weatherAlertCheck from './triggers/weather-alert-check.trigger';
import * as emailSender from './triggers/email-sender.trigger';

module.exports = { app, locationDeleteTrigger, fenceCheckTrigger, pushTrigger, subscriptionReceiptSendToAdmin, weatherAlertCheck, emailSender }