import baseController from './base.controller';
import controlerInterface from "../interfaces/controller.interface";
import express = require('express');

import generateRequestContextMongo from '../mongo/generate-request-context.mongo';
import serviceFactory from '../services/service.factory';
import httpHelper from '../helpers/http.helper';
import config from '../config/config';
import stringHelper from '../helpers/string.helper';
import firebaseFactory from '../firebase/firebase.factory';
import { platformsString } from '../enum/platform.enum';
import { deviceStatusString } from '../enum/device.enum';

import * as firebaseAdmin from 'firebase-admin';

class testsController extends baseController
    implements controlerInterface {

    private _storageFirebase = firebaseFactory.storage();


    constructor() {
        super();
    }

    setRouter(router: express.Router): void {
        router.get(this.createPrivateEndpoint('tests/request-context/:deviceId'), this.requestContext);
        router.post(this.createPrivateEndpoint('tests/send-receipt-to-admin'), this.sendReceiptToAdmin);
        router.post(this.createPrivateEndpoint('tests/receive-receipt-as-admin'), this.receiveReceiptAsAdmin);
        router.post(this.createPrivateEndpoint('tests/iot-validation'), this.iotValidation);
        router.post(this.createPrivateEndpoint('tests/iot-activation'), this.iotActivation);
        router.post(this.createRestrictedEndpoint('tests/upload'), this.upload);
        router.get(this.createPrivateEndpoint('tests/teste1'), this.teste1);
        router.get(this.createPrivateEndpoint('version'), this.version);
    }

    private version = async (req: express.Request, res: express.Response) => {
        res.json({ version: global.config.version })
    }


    private teste1 = async (req: express.Request, res: express.Response) => {

        await firebaseAdmin
            .database()
            .ref('users')
            .child('bTORvUDdXAMnMzRydkLbbbveVyq1')
            .child('changing')
            .child('receipt/ts')
            .set((new Date()).getTime())


        res.json({ ok: 1 })
    }

    private upload = async (req: express.Request, res: express.Response) => {

        //        try {

        let base64 = stringHelper.base64Process(req.body.photo);

        let imageBuffer = Buffer.from(base64, 'base64');

        let file = this._storageFirebase.fileFactory(req.context.uid);

        await file.save(imageBuffer, {
            metadata: {
                contentType: 'image/jpeg'
            },
            public: true,
            validation: 'md5'
        });

        await file.makePublic();

        res.json(file)

        //      }
        //      catch (error) {
        //          res.status(500).json(error);
        //     }



    }

    private requestContext = async (req: express.Request, res: express.Response) => {
        try {
            let model = await generateRequestContextMongo.byDeviceId(req.params.deviceId);
            res.json(model)
        }
        catch (error) {
            this.cl("erro", error);
            res.status(500).json(error)
        }
    }

    private sendReceiptToAdmin = async (req: express.Request, res: express.Response) => {
        try {

            let requestContext = await generateRequestContextMongo.byUid(req.body.uid);

            let service = serviceFactory.subscriptionReceipt(requestContext);

            if (req.body.uid == 1) {
                await service.sendToAdmin(req.body.transactionId);
            }

            res.status(500).json({ msg: 'fake' })
        }
        catch (error) {
            res.status(500).json(error)
        }
    }

    private receiveReceiptAsAdmin = async (req: express.Request, res: express.Response) => {
        try {

            let ts = (new Date).getTime();

            let producId = req.body.id;

            if (req.body.platform == platformsString.apple) {
                producId = req.body.data.receipt.in_app[0].product_id;
            }
            else if (req.body.platform == platformsString.google) {
                producId = req.body.data.productId;
            }

            let _split = producId.split('.');
            let numberOfLicences = 0;
            let _person = _split[_split.length - 1];

            if (_person == 'one_person') {
                numberOfLicences = 1;
            }
            else if (_person == 'two_person') {
                numberOfLicences = 2;
            }
            else if (_person == 'three_person') {
                numberOfLicences = 3;
            }
            else if (_person == 'four_person') {
                numberOfLicences = 4;
            }
            else if (_person == 'five_person') {
                numberOfLicences = 5;
            }

            let subscription = {
                "uid": req.body.uid,
                "subscriptionId": req.body.transactionId,
                "transactionId": req.body.transactionId,
                "active": true,
                "lastStatus": "ativo",
                "startTime": ts,
                "expiryTime": ts + (86400000 * 365),
                "resumeTime": 0,
                "product": {
                    "id": producId,
                    "name": "Foxtter Premium",
                    "licenses": numberOfLicences
                }
            };

            let adminConfig = config.adminConfig();

            await httpHelper.put(adminConfig.url + '/private/subscription/receipt/processed', subscription);

            res.end()
        }
        catch (error) {
            res.status(500).json(error)
        }
    }

    private iotValidation = async (req: express.Request, res: express.Response) => {

        console.log(">>>>", "Passou pelo fake")

        if (req.body.token == 'erro-validation') {
            res.status(400).json({});
        }
        else {
            res.json({ status: deviceStatusString.active });
        }

    }

    private iotActivation = async (req: express.Request, res: express.Response) => {

        if (req.body.token == 'erro-activation') {
            res.status(400).end();
        }
        else {
            res.json({ status: deviceStatusString.active });
        }

    }


}

export default testsController;