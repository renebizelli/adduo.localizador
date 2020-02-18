import { expect, assert } from 'chai';
import httpHelper from '../helpers/http.helper';
import timeStampHelper from '../helpers/timestamp.helper';
import * as firebase from 'firebase';
import * as firebaseAdmin from 'firebase-admin';
import userSchema from '../models/user.schema';
import deviceSchema from '../models/device.schema';
import monitoringCodeSchema from '../models/monitoring-code.schema';
import weatherAlertSchema from '../models/weather-alert.schema';
import fenceSchema from '../models/fence.schema';
import locationHistorySchema from '../models/location-history.schema';
import historySchema from '../models/history.schema';
import constantSchema from '../models/constant.schema';
import '../prototypes/string.prototype';
import './inits';
import { productEnumString } from '../enum/product.enum';
import dtoToFirebaseParser from '../parsers/dto-to-firebase.parser';
import userModel from '../models/user.model';
import { timestampPart } from '../enum/timestamp.enum';

import * as configTest from './config.json';
import * as setupConfigTest from './setup.test-config.json';
import * as userCreateConfigTest from './user-create.test-config.json';
import * as deviceSmartphoneCreateConfigTest from './device-smartphone-create.test-config.json';
import * as deviceIotCreateConfigTest from './device-iot-create.test-config.json';
import * as updateAliasCreateConfigTest from './update-alias.test-config.json';
import * as locationSmartphoneConfigTest from './location-smartphone.test-config.json';
import * as locationIotConfigTest from './location-iot.test-config.json';
import * as fenceConfigTest from './fence.test-config.json';
import { fenceStatusString } from '../enum/fence.enum';
import { cultureString } from '../enum/culture.enum';
import { alertPriority } from '../enum/alert.enum';
import { notificationTypesString } from '../enum/notification.enum';
import localeToTest from './locale-to-test';
import { constantString } from '../enum/constant.enum';
import notificationParser from '../parsers/notification.parse';
import { deviceStatusString, deviceTypesString } from '../enum/device.enum';
import { httpStatusCode } from '../enum/http-status.enum';

function header(user?: any) {

    return {
        "Authorization": user && user.token,
        "ts": "auth",
        "Accept-Language": user && user.culture
    }

}

function userModelById(uid: string) {
    return userSchema.findById(uid);
}

function userFirebaseById(uid: string) {
    return firebaseAdmin.auth().getUser(uid);
}

function fenceModelById(id: string) {
    return fenceSchema.findById(id);
}

function weatherAlertModelOne() {
    return weatherAlertSchema.findOne({});
}

async function constantOne(id: string) {
    let constant = await constantSchema.findOne({ _id: id });
    return constant && constant.data;
}

let _getNumberIndex = 1;
function getNumber() {
    return (new Date()).getMilliseconds() * (_getNumberIndex++);
}

function nearCalculate(lat: number, lng: number, radius: number) {
    const earth = 6378.137;  //radius of the earth in kilometer
    let m = (1 / ((2 * Math.PI / 360) * earth)) / 1000;  //1 meter in degree
    m = 0.0000089;
    return {
        lat: lat + ((radius + 10) * m),
        lng: lng + ((radius + 10) * m) / Math.cos(lat * (Math.PI / 100))
    }
}

async function locationFirebaseByDeviceId(deviceId: string) {
    return (await firebaseAdmin.database().ref('devices').child(deviceId).once('value')).val();
}

async function userFirebaseByUid(uid: string) {
    return (await firebaseAdmin.database().ref('users').child(uid).once('value')).val();
}

async function locationFirebaseByDevice(deviceId: string) {
    return (await firebaseAdmin.database().ref('devices').child(deviceId).once('value')).val();
}

async function updateLocation(location: any, u: user) {
    let headers = header(u);
    await httpHelper['put'](configTest.url + '/restricted/location/' + u.device.smartphoneId, location, headers);
}

async function inactivateAccount(u: user) {
    return userSchema.updateOne({ _id: u.uid }, { "subscription.active": false });
}

async function paymentoRequiredTest(u: user, method: string, url: string) {

    try {
        let headers = header(u);

        if (method == 'post' ||
            method == 'put') {
            await httpHelper[method](configTest.url + url, {}, headers);
        }
        else if (method == 'get' ||
            method == 'delete') {
            await httpHelper[method](configTest.url + url, headers);
        }

        assert.isNotOk(">> " + url, "Passou mesmo com assinatura inválida")
    }
    catch (error) {
        if (error.custom) {
            expect(error.status).to.be.equal(httpStatusCode.paymentRequired);
        }
        else {
            throw error;
        }
    }

}


async function testBadRequest(item: any, endpoint: string, method: string, user?: user) {

    let errorCode = '';

    try {

        method = method.toLowerCase();

        if (method == "post" || method == "put" || method == "get" || method == "delete") {
            let headers = header(user);
            await httpHelper[method](configTest.url + endpoint, item.data, headers)
        }

    }
    catch (error) {
        errorCode = error.code;
    }

    expect(errorCode).to.equal(item.code);

}

async function testAlert(u: user, link: user, data: any) {

    return new Promise(async (resolve, reject) => {

        let alert = (await firebaseAdmin
            .database()
            .ref('alerts')
            .child(link.uid)
            .once('value')).val()

        let error = [];

        for (let a in alert) {
            for (let p in data) {
                if (alert[a][p] != data[p]) {
                    error.push('Campo ' + p + ' não confere:' + alert[a][p] + ' != ' + data[p]);
                }
            }
        }

        await firebaseAdmin
            .database()
            .ref('alerts')
            .child(link.uid)
            .set(null);

        if (error.length) {
            reject(error)
        }
        else {
            resolve();
        }

    });

}

async function testFenceStatus(u: user, location: location, expertedStatus: fenceStatusString) {

    return new Promise(async (resolve, reject) => {

        let data = {
            "type": "",
            "lat": location.lat,
            "lng": location.lng,
            "altitude": (10 + u.number).toString(),
            "speed": (11 + u.number).toString(),
            "accuracy": 0
        };

        await updateLocation(data, u);

        setTimeout(async () => {

            let userLink = users[u.userLink.i];

            let fence = await fenceModelById(userLink.fence.fenceId);

            let currentStatus = fence && fence.monitored[0].status

            if (fence &&
                fence.monitored[0].uid == u.uid &&
                fence.monitored[0].status == expertedStatus) {
                resolve()
            }
            else {
                reject('status: ' + currentStatus + ' != ' + expertedStatus);
            }

        }, configTest.waitingToTriggerSeconds * 1000);

    });
}

let testModeFull = configTest.test.mode == 'full'

let ts = timeStampHelper.get();

class userLink {
    i: number = 0;
    alias: string = '';
}

class fence {
    fenceId: string = '';
    insert: fenceItem = new fenceItem();
    update: fenceItem = new fenceItem();
}

class fenceItem {
    priority: number = 0;
    radius: number = 0;
    address: string = '';
    title: string = '';
    location: location = new location();
}

class location {
    lat: number = 0;
    lng: number = 0;
}

class info {
    email: string = '';
    name: string = '';
    phone: string = '';
    password: string = '';
}

class device {
    smartphoneId: string = '';
    iotId: string = '';
}

class user {
    uid: string = '';
    register: info = new info();
    update: info = new info();
    token: string = '';
    ts: number = 0;
    culture: string = '';
    platform: string = '';
    device: device = new device();
    model?: userModel;
    code: string = '';
    codeOld: string = '';
    userLink: userLink = new userLink();
    test: boolean = false;
    number: number = 0;
    fence: fence = new fence()
}

let userA: user = {
    uid: '',
    register: {
        email: 'test-a-register-' + ts + '@nextter-test.com.br',
        name: 'Atest de Register ' + ts,
        phone: '+5511' + ts.toString().substr(1, 9),
        password: 'TesteA#' + ts.toString().substr(1, 3),
    },
    update: {
        email: 'test-a-update' + ts + '@nextter-test.com.br',
        name: 'Atest de Update ' + ts,
        phone: '+5511' + ts.toString().substr(0, 9),
        password: 'TesteA#' + ts.toString().substr(0, 3),
    },
    token: '',
    ts: 0,
    culture: 'pt',
    platform: 'apple',
    device: {
        smartphoneId: '',
        iotId: ''
    },
    code: '',
    codeOld: '',
    userLink: { i: 1, alias: 'Btest alterado' },
    test: true,
    number: ts,
    fence: {
        fenceId: '0',
        insert: {
            address: 'Rua teste a insert',
            title: 'Teste A Insert',
            radius: (new Date()).getSeconds() + 20,
            priority: 8,
            location: {
                lat: parseFloat(-23 + '.' + ts),
                lng: parseFloat(-46 + '.' + (ts + getNumber()))
            }
        },
        update: {
            title: 'Teste A Update',
            address: 'Rua teste a update',
            radius: (new Date()).getSeconds() + 30,
            priority: 1,
            location: {
                lat: parseFloat(-23 + '.' + (ts + getNumber())),
                lng: parseFloat(-46 + '.' + (ts + getNumber()))
            }
        }
    }
}

let s = ts.toString().split("").reverse().join("");

ts = parseInt(s);

let userB: user = {
    uid: '',
    register: {
        email: 'test-b-register-' + ts + '@nextter-test.com.br',
        name: 'Btest de Register ' + ts,
        phone: '+5511' + ts.toString().substr(1, 9),
        password: 'TesteB#' + ts.toString().substr(1, 3),
    },
    update: {
        email: 'test-b-update' + ts + '@nextter-test.com.br',
        name: 'Btest de Update ' + ts,
        phone: '+5511' + ts.toString().substr(0, 9),
        password: 'TesteB#' + ts.toString().substr(0, 3),
    },
    token: '',
    ts: 0,
    culture: 'en',
    platform: 'google',
    device: {
        smartphoneId: '',
        iotId: ''
    },
    code: '',
    codeOld: '',
    userLink: { i: 0, alias: 'Atest alterado' },
    test: false,
    number: ts,
    fence: {
        fenceId: '0',
        insert: {
            address: 'Rua teste b insert ',
            title: 'Teste B Insert',
            radius: (new Date()).getSeconds() + 40,
            priority: 1,
            location: {
                lat: parseFloat(-23 + '.' + ts),
                lng: parseFloat(-46 + '.' + (ts + getNumber()))
            }
        },
        update: {
            address: 'Rua teste b update ',
            title: 'Teste B Update',
            radius: (new Date()).getSeconds() + 50,
            priority: 8,
            location: {
                lat: parseFloat(-23 + '.' + ts + getNumber()),
                lng: parseFloat(-46 + '.' + (ts + getNumber()))
            }
        }
    }
}

let users = [userA, userB];


describe('Usuários', async () => {

    it('testes', async () => {

        // let title = localeToTest.getToTest('text:accept.title', cultureString.pt)
        // let body = localeToTest.getToTest('text:accept.body', cultureString.pt)
        // title += 'ss' + title
        // body += 'ss' + body

    });

    for (let u of users) {

        if (testModeFull) {

            if (u.test) {
                for (let item of userCreateConfigTest["invalid-items"]) {
                    it(userCreateConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, userCreateConfigTest.endpoint, userCreateConfigTest.method) });
                }
            }

        }

        it('Cadastrar' + u.register.name, async () => {

            let user = {
                name: u.register.name,
                email: u.register.email,
                password: u.register.password,
                phoneNumber: u.register.phone
            }

            let result = await httpHelper.post(configTest.url + '/public/users', user);

            u.uid = result.uid;

            if (testModeFull) {
                expect(result.uid).to.be.a('string');
                expect(result.email).to.equal(u.register.email);
                expect(result.displayName).to.equal(u.register.name);
                expect(result.phoneNumber).to.equal(u.register.phone);
            }

        });

        if (testModeFull) {
            it('Firebase ' + u.register.name, async () => {
                let user = await userFirebaseByUid(u.uid);
                expect(user).to.not.null
            });
        }

    }

});

describe('Sessão', async () => {

    if (testModeFull) {

        it('Login inválido', async () => {
            let errorCode = '';
            try {

                await firebase
                    .auth()
                    .signInWithEmailAndPassword(userA.update.email, userA.update.password);

            }
            catch (error) {
                errorCode = error.code;
            }

            expect(errorCode).to.equal('auth/user-not-found');

        });

    }

    for (let u of users) {

        it('Login com sucesso ' + u.register.name, async () => {

            let userRecord =
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(u.register.email, u.register.password);

            if (userRecord.user) {

                u.token = await userRecord.user.getIdToken()

                if (testModeFull) {
                    expect(u.uid).to.equal(userRecord.user.uid);
                }
            }

        });
    }

});

describe('Ativação', async () => {

    for (let u of users) {

        it('Método complement() ' + u.uid, async () => {

            let headers = header(u);
            await httpHelper.post(configTest.url + '/restricted/users/complement', {}, headers)

            if (testModeFull) {

                let userModel = await userModelById(u.uid);

                expect(userModel).to.be.not.null;

                if (userModel) {

                    expect(u.uid).to.equal(userModel._id);
                    expect(u.register.email).to.equal(userModel.contact.email);
                    expect(u.register.phone).to.equal(userModel.contact.cellPhone);
                    expect(userModel.currentSmartphone.platform).to.equal("none");
                    expect(u.register.name).to.equal(userModel.info.name);
                    expect(u.culture).to.equal(userModel.info.culture);

                    expect(userModel.info.createdAt).to.be.a("number");
                    expect(userModel.session.logged).to.equal(false);
                    expect(userModel.token.push).to.be.empty;

                    let freeDaysAllowed = await constantOne(constantString.freeDaysAllowed);
                    let expiryTime = timeStampHelper.addDays(userModel.info.createdAt, freeDaysAllowed);
                    expect(userModel.subscription.expiryTime).to.equal(expiryTime);

                    expect(userModel.subscription.subscriptionId).to.equal("0");
                    expect(userModel.subscription.active).to.equal(true);
                    expect(userModel.subscription.active).to.equal(true);
                    expect(userModel.subscription.product.sku).to.equal(productEnumString.free);
                    expect(userModel.subscription.product.numberOfLicenses).to.equal(0);
                }
            }
        });

        if (testModeFull) {
            if (u.test) {
                for (let item of deviceSmartphoneCreateConfigTest["invalid-items"]) {
                    it(deviceSmartphoneCreateConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, deviceSmartphoneCreateConfigTest.endpoint, deviceSmartphoneCreateConfigTest.method, u) });
                }
            }
        }

        it('Cadastrar device Smartphone ' + u.uid, async () => {

            let data = {
                alias: 'device ' + u.register.name,
                platform: u.platform
            };

            let headers = header(u);
            let device = await httpHelper.post(configTest.url + '/restricted/device/smartphone', data, headers)

            u.device.smartphoneId = device._id.toString();

            if (testModeFull) {
                expect(device._id).to.be.a("string");
                expect(device.deviceId).to.be.a("string");
                expect(device.userUid).to.be.equal(u.uid);
                expect(device.type).to.be.equal(deviceTypesString.smartphone);
                expect(device.status).to.be.equal(deviceStatusString.active);
            }

        });

        if (testModeFull) {
            if (u.test) {
                for (let item of setupConfigTest["invalid-items"]) {
                    it(setupConfigTest.name + ' ' + item.name, async () => { testBadRequest(item, setupConfigTest.endpoint, setupConfigTest.method, u) })
                }
            }
        }

        it('Setup com sucesso', async () => {

            let data = {
                deviceId: u.device.smartphoneId,
                platform: u.platform
            };

            let headers = header(u);
            await httpHelper.post(configTest.url + '/restricted/session/setup', data, headers)

        });

        if (testModeFull) {

            it('Setup MongoDb ok', async () => {

                let model = await userModelById(u.uid);

                expect(model).to.be.not.null;

                if (model) {

                    u.model = model;

                    expect(u.model.currentSmartphone.deviceId.toString()).to.equal(u.device.smartphoneId);
                    expect(u.model.currentSmartphone.platform.toString()).to.equal(u.platform);

                    // 10s do login ate este momento
                    let diff = timeStampHelper.diffNow(u.model.session.last_signin, timestampPart.seconds);
                    expect(diff).to.be.lte(10);

                    expect(u.model.session.logged).to.be.equal(true);
                }
            });

        }

        if (testModeFull) {

            it('Setup Device Firebase', async () => {

                if (u.model) {

                    let deviceNode = dtoToFirebaseParser.toLocation(u.uid);

                    let device = await locationFirebaseByDeviceId(u.device.smartphoneId)

                    expect(device).to.deep.equal(deviceNode);
                }

            });

            it('Setup currentSmartphone Firebase ' + u.update.name, async () => {
                let user = await userFirebaseByUid(u.uid);
                expect(user.changing.currentSmartphone).to.be.equal(u.device.smartphoneId, "currentSmartphone invalido");
            });

        }

        it('Atualização de token para push', async () => {

            let data = {
                token: u.number.toString()
            };

            let headers = header(u);
            await httpHelper.post(configTest.url + '/restricted/push/refreshtoken', data, headers);

            let userModel = await userModelById(u.uid);

            expect(userModel).to.be.not.null;

            if (userModel) {
                expect(userModel.token.push).to.be.equal(u.number.toString());
            }

        });

    }

});

describe('Deletar device anterior no Firebase pela trigger', async () => {

    for (let u of users) {

        it('Deletar ' + u.uid, async () => {

            return new Promise(async (resolve, reject) => {

                let data = {
                    alias: 'device ' + u.register.name,
                    platform: u.platform
                };

                let headers = header(u);
                let device = await httpHelper.post(configTest.url + '/restricted/device/smartphone', data, headers)

                let datSetup = {
                    deviceId: device._id,
                    platform: u.platform
                };

                await httpHelper.post(configTest.url + '/restricted/session/setup', datSetup, headers)

                setTimeout(async () => {

                    let deviceFirebase = await locationFirebaseByDeviceId(u.device.smartphoneId)

                    if (deviceFirebase) {
                        reject('Device não excluído pela trigger')
                    }
                    else {
                        u.device.smartphoneId = device._id.toString();
                        resolve();
                    }

                }, configTest.waitingToTriggerSeconds * 1000);

            })
        });
    }
});

describe('Device Iot ', async () => {

    for (let u of users) {

        if (testModeFull) {
            if (u.test) {
                for (let item of deviceIotCreateConfigTest["invalid-items"]) {
                    it(deviceIotCreateConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, deviceIotCreateConfigTest.endpoint, deviceIotCreateConfigTest.method, u) });
                }
            }
        }

        it('Cadastrar device Iot ' + u.uid, async () => {

            let data = {
                alias: 'device IOT ' + u.register.name,
                externalId: getNumber(),
                token: getNumber()
            };

            let headers = header(u);
            let device = await httpHelper.post(configTest.url + '/restricted/device/iot', data, headers)

            u.device.iotId = device.deviceId;

            if (testModeFull) {
                expect(device._id).to.be.a("string");
                expect(device.deviceId).to.be.a("string");
                expect(device.userUid).to.be.equal(u.uid);
                expect(device.type).to.be.equal(deviceTypesString.iot);
                expect(device.status).to.be.equal(deviceStatusString.active);
            }

        });

        it('Verificar se foi add no user ' + u.uid, async () => {

            let userModel = await userModelById(u.uid);
            expect(user).to.be.not.undefined;
            if (userModel) {
                let iot = userModel.monitoring.iots[0];
                expect(iot.deviceId).to.include(u.device.iotId);
            }

        });

        it('Verificar se foi add no Firebase ' + u.uid, async () => {

            let deviceNode = dtoToFirebaseParser.toLocation(u.uid);

            let device = await locationFirebaseByDeviceId(u.device.iotId)

            expect(device).to.deep.equal(deviceNode);

        });

    }

});



describe('Atualização de usuário', async () => {

    for (let u of users) {

        it('Usuário ' + u.update.name, async () => {

            let user = {
                name: u.update.name,
                email: u.update.email,
                phoneNumber: u.update.phone,
                password: u.update.password
            };

            let headers = header(u);

            await httpHelper['put'](configTest.url + '/restricted/users', user, headers);

            assert.isOk("Update OK user " + u.update.name);

        });

        it('Verificar atualização no Mongo ' + u.update.name, async () => {

            let user = await userModelById(u.uid);

            expect(user).to.be.not.null;

            if (user) {
                expect(user.info.name).to.be.equal(u.update.name);
                expect(user.contact.email).to.be.equal(u.update.email);
                expect(user.contact.cellPhone).to.be.equal(u.update.phone);
            }

        });

        it('Verificar atualização no Firebase ' + u.update.name, async () => {

            let user = await userFirebaseById(u.uid);

            expect(user).to.be.not.null;

            if (user) {
                expect(user.displayName).to.be.equal(u.update.name);
                expect(user.email).to.be.equal(u.update.email);
                expect(user.phoneNumber).to.be.equal(u.update.phone);
            }

        });

        it('Login de dados atualizados ' + u.update.name, async () => {

            let userRecord =
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(u.update.email, u.update.password);

            if (userRecord.user) {

                u.token = await userRecord.user.getIdToken()

                if (testModeFull) {
                    expect(u.uid).to.equal(userRecord.user.uid);
                }
            }

        });

        it('Alteração de Idioma ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let headers = header(u);

            headers["Accept-Language"] = userLink.culture

            await httpHelper['put'](configTest.url + '/restricted/users/culture', {}, headers);

            let user = await userModelById(u.uid);

            if (user) {
                expect(user.info.culture).to.equal(userLink.culture);

                headers["Accept-Language"] = u.culture;
                await httpHelper['put'](configTest.url + '/restricted/users/culture', {}, headers);
            }

        });


    }

});


describe('Monitoramento', async () => {

    for (let u of users) {

        it('Gerar código de solicitação ' + u.update.name, async () => {

            let headers = header(u);
            let result = await httpHelper.get(configTest.url + '/restricted/monitoring/code', headers);

            if (result && result.code) {
                u.code = result && result.code;
            }

            if (testModeFull) {
                expect(result).to.be.not.null;
                expect(result.code).to.have.lengthOf(6);
            }
        });

        it('Atualizar código de solicitação ' + u.update.name, async () => {

            let headers = header(u);
            let result = await httpHelper.get(configTest.url + '/restricted/monitoring/refreshcode', headers);

            if (testModeFull) {
                expect(result).to.be.not.null;
                expect(result.code).to.have.lengthOf(6);
                expect(result.code).to.be.not.equal(u.code);
            }

            if (result && result.code) {
                u.codeOld = u.code;
                u.code = result && result.code;
            }

        });
    }

    for (let u of users) {

        if (u.test && testModeFull) {

            it('Optin inválido (código antigo) ' + u.update.name, async () => {
                let errorCode = ''

                try {
                    let userLink = users[u.userLink.i];
                    let headers = header(u);
                    await httpHelper['get'](configTest.url + '/restricted/monitoring/optin/' + userLink.codeOld, headers);
                }
                catch (error) {
                    errorCode = error.code;
                }

                expect(errorCode).to.equal('error:monitoring.request-code-invalid');

            });

        }

        it('Optin com sucesso ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];
            let headers = header(u);
            let result = await httpHelper['get'](configTest.url + '/restricted/monitoring/optin/' + userLink.code, headers);

            if (testModeFull) {
                expect(result.text).to.match(/Update/)
            }

        });

        if (u.test && testModeFull) {

            it('Accept inválido (código antigo) ' + u.update.name, async () => {

                let errorCode = ''

                try {
                    let userLink = users[u.userLink.i];
                    let headers = header(u);

                    let data = {
                        code: userLink.codeOld
                    }
                    await httpHelper['post'](configTest.url + '/restricted/monitoring/accept', data, headers);
                }
                catch (error) {
                    errorCode = error.code;
                }

                expect(errorCode).to.equal('error:monitoring.request-code-invalid');

            });

        }

        it('Accept com sucesso ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];
            let headers = header(u);

            let data = {
                code: userLink.code
            }
            let result = await httpHelper['post'](configTest.url + '/restricted/monitoring/accept', data, headers);

            if (testModeFull) {
                expect(result.nameUserAllowed).to.be.equal(userLink.update.name);
            }

        });


        it('Verificar alerta de accept ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let title = localeToTest.getToTest('text:accept.title', <cultureString>userLink.culture)
            let body = localeToTest.getToTest('text:accept.body', <cultureString>userLink.culture)
            body = body.naming(u.update.name);

            let data: any = {
                title: title,
                body: body,
                idType: 0,
                userUid: u.uid,
                monitoredUid: u.uid,
                priority: alertPriority.default,
                type: notificationTypesString.accept
            }

            await testAlert(u, users[u.userLink.i], data);
        });


        it('Verificar monitorável foi cadastrado com sucesso ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let userModel = await userModelById(userLink.uid);

            if (testModeFull) {

                expect(userModel).to.be.not.null;

                if (userModel) {
                    let m = userModel.monitoring.users[0];
                    expect(m.active).to.be.equal(true);
                    expect(m.alias).to.be.equal(u.update.name);
                    expect(m.selected).to.be.equal(true);
                    expect(m.userUid).to.be.equal(u.uid);
                    expect(m.lockedUpTo).to.be.equal(0);
                }
            }

        });

        it('Verificar se permissão foi incluída com sucesso ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let userModel = await userModelById(u.uid);

            if (testModeFull) {

                expect(userModel).to.be.not.null;

                if (userModel) {
                    let a = userModel.monitoring.allowed[0];
                    expect(a).to.include(userLink.uid);
                }
            }

        });

    }

    for (let u of users) {

        if (u.test && testModeFull) {

            for (let item of updateAliasCreateConfigTest["invalid-items"]) {
                it(updateAliasCreateConfigTest.name + ' ' + item.name, async () => {
                    let userLink = users[u.userLink.i];
                    let endpoint = updateAliasCreateConfigTest.endpoint.stringFormat([userLink.uid]);
                    await testBadRequest(item, endpoint, updateAliasCreateConfigTest.method, u)
                });
            }

        }

        it('Atualizar Alias do monitorável com sucesso ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];
            let headers = header(u);

            let data = {
                alias: u.userLink.alias
            };

            await httpHelper['put'](configTest.url + '/restricted/monitoring/monitorable/' + userLink.uid, data, headers);

            if (testModeFull) {
                let userModel = await userModelById(u.uid);

                if (userModel) {
                    let m = userModel.monitoring.users[0];
                    expect(m.alias).to.be.equal(u.userLink.alias);
                }
            }

        });

        if (testModeFull) {

            it('Lista vazia de unselected' + u.update.name, async () => {
                let headers = header(u);
                let items = await httpHelper['get'](configTest.url + '/restricted/monitoring/unselected', headers);
                expect(items).to.be.empty;
            });

        }

        if (testModeFull) {

            it('Remover selected da lista ' + u.update.name, async () => {

                let userLink = users[u.userLink.i];
                let headers = header(u);

                await httpHelper['delete'](configTest.url + '/restricted/monitoring/selected/' + userLink.uid, headers);

                let userModel = await userModelById(u.uid);

                if (userModel) {
                    let m = userModel.monitoring.users[0];
                    expect(m.selected).to.be.false;
                }

            });

        }

        if (testModeFull) {

            it('Lista de unselected ok ' + u.update.name, async () => {
                let headers = header(u);
                let items = await httpHelper['get'](configTest.url + '/restricted/monitoring/unselected', headers);

                let userLink = users[u.userLink.i];

                let s = items[0];
                expect(s.monitorableUid).to.be.equal(userLink.uid);
                expect(s.alias).to.be.equal(u.userLink.alias);

            });

        }

        if (testModeFull) {

            it('Marcar monitorável como selected ' + u.update.name, async () => {

                let userLink = users[u.userLink.i];
                let headers = header(u);
                await httpHelper['put'](configTest.url + '/restricted/monitoring/selected/' + userLink.uid, {}, headers);

                let userModel = await userModelById(u.uid);

                if (userModel) {
                    let m = userModel.monitoring.users[0];
                    expect(m.selected).to.be.true;
                }

            });

        }

        if (testModeFull) {

            it('Lista de selected para o mapa ok ' + u.update.name, async () => {

                let userLink = users[u.userLink.i];
                let headers = header(u);

                let selected = await httpHelper['get'](configTest.url + '/restricted/monitoring/selected-to-map', headers);

                let s = selected[0];
                expect(s.monitorableUid).to.be.equal(userLink.uid);
                expect(s.deviceId).to.be.equal(userLink.device.smartphoneId);
                expect(s.alias).to.be.equal(u.userLink.alias);
                expect(s.contact.email).to.be.equal(userLink.update.email);
                expect(s.contact.cellPhone).to.be.equal(userLink.update.phone);

            });

        }

        if (testModeFull) {

            it('Lista de selected para a tela account ok' + u.update.name, async () => {

                let userLink = users[u.userLink.i];
                let headers = header(u);

                let selected = await httpHelper['get'](configTest.url + '/restricted/monitoring/selected-to-account', headers);

                let s = selected[0];
                expect(s.monitorableUid).to.be.equal(userLink.uid);
                expect(s.alias).to.be.equal(u.userLink.alias);
                expect(s.daysLeft).to.be.a("number");
                expect(s.canBeChanged).to.be.false;
            });

        }

    }


});


describe('Localização', async () => {

    for (let u of users) {

        if (u.test && testModeFull) {
            for (let item of locationSmartphoneConfigTest["invalid-items"]) {
                it(locationSmartphoneConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, locationSmartphoneConfigTest.endpoint, locationSmartphoneConfigTest.method, u) });
            }
        }

        it('Smartphone ok', async () => {

            let location = {
                "type": "",
                "lat": -23,
                "lng": -46,
                "altitude": (10 + u.number).toString(),
                "speed": (11 + u.number).toString(),
                "accuracy": (12 + u.number).toString()
            }

            await updateLocation(location, u);

            if (testModeFull) {

                let locationFirebase = await locationFirebaseByDevice(u.device.smartphoneId);

                expect(locationFirebase.location).to.not.be.null;
                expect(locationFirebase.location.lat).to.be.equal(location.lat);
                expect(locationFirebase.location.lng).to.be.equal(location.lng);
                expect(locationFirebase.location.altitude).to.be.equal(location.altitude);
                expect(locationFirebase.location.speed).to.be.equal(location.speed);
                expect(locationFirebase.location.accuracy).to.be.equal(location.accuracy);

                if (u.test) {
                    expect(locationFirebase.location.updatedAt).to.be.gte(u.number);
                }

            }

        });

        if (testModeFull) {

            if (u.test) {
                for (let item of locationIotConfigTest["invalid-items"]) {
                    it(locationIotConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, locationIotConfigTest.endpoint, locationIotConfigTest.method, u) });
                }
            }
        }

        if (testModeFull) {

            it('Iot ok', async () => {

                let location = {
                    "type": "position",
                    "lat": -33,
                    "lng": -53,
                    "altitude": (10 + u.number).toString(),
                    "speed": (11 + u.number).toString(),
                    "accuracy": (12 + u.number).toString(),
                    "accuracyState": "coarse"
                }

                await updateLocation(location, u);

                let locationFirebase = await locationFirebaseByDevice(u.device.smartphoneId);

                expect(locationFirebase.location).to.not.be.null;
                expect(locationFirebase.location.lat).to.be.equal(location.lat);
                expect(locationFirebase.location.lng).to.be.equal(location.lng);
                expect(locationFirebase.location.altitude).to.be.equal(location.altitude);
                expect(locationFirebase.location.speed).to.be.equal(location.speed);
                expect(locationFirebase.location.accuracy).to.be.equal(location.accuracy);
                expect(locationFirebase.params.accuracyState).to.be.equal(location.accuracyState);

                if (u.test) {
                    expect(locationFirebase.location.updatedAt).to.be.gte(u.number);
                }

            });

        }

    }

});

describe('Cercas virtuais', async () => {

    for (let u of users) {


        if (u.test && testModeFull) {
            for (let item of fenceConfigTest["invalid-items"]) {
                it(fenceConfigTest.name + ' ' + item.name, async () => { await testBadRequest(item, fenceConfigTest.endpoint, fenceConfigTest.method, u) });
            }
        }

        if (u.test) {

            it('Criar sem usuários dentro ' + u.update.name, async () => {

                let headers = header(u);

                let data = {
                    title: u.fence.insert.title,
                    address: u.fence.insert.address,
                    priority: u.fence.insert.priority,
                    radius: u.fence.insert.radius,
                    lat: u.fence.insert.location.lat,
                    lng: u.fence.insert.location.lng,
                }

                let fence = await httpHelper['post'](configTest.url + '/restricted/fence', data, headers);

                expect(fence).to.not.be.null;
                expect(fence._id).to.be.a("string");
                expect(fence.lat).to.be.equal(data.lat);
                expect(fence.lng).to.be.equal(data.lng);
                expect(fence.radius).to.be.equal(data.radius);
                expect(fence.title).to.be.equal(data.title);
                expect(fence.address).to.be.equal(data.address);
                expect(fence.priority).to.be.equal(data.priority);
                expect(fence.active).to.be.true;
                expect(fence.createdAt).to.be.a("number");
                expect(fence.monitoredIds).to.be.empty;
                expect(fence.monitored).to.be.empty;
                expect(fence.numberOfMonitoreds).to.be.equal(0);
                expect(fence.userUid).to.be.equal(u.uid);

                u.fence.fenceId = fence._id;
            });

            it('Atualizar cerca com inclusão de usuário ' + u.update.name, async () => {

                let userLink = users[u.userLink.i];

                let headers = header(u);

                let data = {
                    _id: u.fence.fenceId,
                    title: u.fence.update.title,
                    address: u.fence.update.address,
                    priority: u.fence.update.priority,
                    radius: u.fence.update.radius,
                    lat: u.fence.update.location.lat,
                    lng: u.fence.update.location.lng,
                    monitoredIds: [userLink.uid]

                }

                await httpHelper['put'](configTest.url + '/restricted/fence/' + u.fence.fenceId, data, headers);
            });

            it('Detalhes da cerca ' + u.update.name, async () => {

                let userLink = users[u.userLink.i];
                let headers = header(u);

                let fence = await httpHelper['get'](configTest.url + '/restricted/fence/' + u.fence.fenceId, headers);

                expect(fence).to.not.be.null;
                expect(fence._id).to.be.a("string");
                expect(fence.lat).to.be.equal(u.fence.update.location.lat);
                expect(fence.lng).to.be.equal(u.fence.update.location.lng);
                expect(fence.radius).to.be.equal(u.fence.update.radius);
                expect(fence.title).to.be.equal(u.fence.update.title);
                expect(fence.address).to.be.equal(u.fence.update.address);
                expect(fence.priority).to.be.equal(u.fence.update.priority);
                expect(fence.createdAt).to.be.a("number");
                expect(fence.userUid).to.be.equal(u.uid);
                expect(fence.numberOfMonitoreds).to.be.equal(1);
                expect(fence.monitoredIds).to.be.not.empty;
                expect(fence.monitoredIds[0]).to.be.equal(userLink.uid);
                expect(fence.monitored).to.be.not.empty;
                expect(fence.monitored[0].userUid).to.be.equal(userLink.uid);
                expect(fence.monitored[0].uid).to.be.equal(userLink.uid);
                expect(fence.monitored[0].alias).to.be.equal(u.userLink.alias);
            });

            it('Lista de cercas ' + u.update.name, async () => {

                let headers = header(u);

                let fences = await httpHelper['get'](configTest.url + '/restricted/fences', headers);

                let fence = fences[0];

                expect(fence).to.not.be.null;
                expect(fence._id).to.be.a("string");
                expect(fence.lat).to.be.equal(u.fence.update.location.lat);
                expect(fence.lng).to.be.equal(u.fence.update.location.lng);
                expect(fence.radius).to.be.equal(u.fence.update.radius);
                expect(fence.title).to.be.equal(u.fence.update.title);
                expect(fence.address).to.be.equal(u.fence.update.address);
                expect(fence.priority).to.be.equal(u.fence.update.priority);
                expect(fence.createdAt).to.be.a("number");
                expect(fence.numberOfMonitoreds).to.be.equal(1);
            });

            it('Removendo usuário da cerca ' + u.update.name, async () => {

                let headers = header(u);

                let data = {
                    _id: u.fence.fenceId,
                    title: u.fence.update.title,
                    address: u.fence.update.title,
                    priority: u.fence.update.priority,
                    radius: u.fence.update.radius,
                    lat: u.fence.update.location.lat,
                    lng: u.fence.update.location.lng,
                    monitoredIds: []
                }

                await httpHelper['put'](configTest.url + '/restricted/fence/' + u.fence.fenceId, data, headers);
            });

            it('Detalhe da cerca sem o usuário removido ' + u.update.name, async () => {
                let headers = header(u);
                let fence = await httpHelper['get'](configTest.url + '/restricted/fence/' + u.fence.fenceId, headers);
                expect(fence).to.not.be.null;
                expect(fence.numberOfMonitoreds).to.be.equal(0);
            });

            it('Deleta cerca ' + u.update.name, async () => {
                let headers = header(u);
                await httpHelper['delete'](configTest.url + '/restricted/fence/' + u.fence.fenceId, headers);
                assert.isOk('Fence deleted')
            });

            it('Verificação se cerca deletada ' + u.update.name, async () => {
                try {
                    let headers = header(u);
                    await httpHelper['get'](configTest.url + '/restricted/fence/' + u.fence.fenceId, headers);
                    assert.isNotOk('Delete Fence error')
                }
                catch (error) {
                    expect(error.code).to.be.equal("error:fence.not-found")
                }
            });

        }

        it('Criar cerca com usuário dentro ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let headers = header(u);

            let data = {
                title: u.fence.insert.title,
                address: u.fence.insert.address,
                priority: u.fence.insert.priority,
                radius: u.fence.insert.radius,
                lat: u.fence.insert.location.lat,
                lng: u.fence.insert.location.lng,
                monitoredIds: [userLink.uid]
            }

            let fence = await httpHelper['post'](configTest.url + '/restricted/fence', data, headers);

            u.fence.fenceId = fence._id;

            if (testModeFull) {

                fence = await httpHelper['get'](configTest.url + '/restricted/fence/' + u.fence.fenceId, headers);

                expect(fence.numberOfMonitoreds).to.be.equal(1);
                expect(fence.monitoredIds).to.be.not.empty;
                expect(fence.monitoredIds[0]).to.be.equal(userLink.uid);
                expect(fence.monitored).to.be.not.empty;
                expect(fence.monitored[0].userUid).to.be.equal(userLink.uid);
                expect(fence.monitored[0].uid).to.be.equal(userLink.uid);
                expect(fence.monitored[0].alias).to.be.equal(u.userLink.alias);
                expect(fence.monitored[0].status).to.be.equal(fenceStatusString.none);

            }
        });

    }

    for (let u of users) {

        it('Verificar se está perto de cerca ' + u.update.name, async () => {
            let userLink = users[u.userLink.i];
            let near = nearCalculate(userLink.fence.insert.location.lat, userLink.fence.insert.location.lng, userLink.fence.insert.radius);
            await testFenceStatus(u, near, fenceStatusString.near);
        });

        it('Verificar alerta perto de cerca ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let title = localeToTest.getToTest('text:fence.status.title', <cultureString>userLink.culture)
            let body = localeToTest.getToTest('text:fence.status.body.near', <cultureString>userLink.culture)
            body = body.naming(u.update.name);
            body = body.stringFormat([userLink.fence.insert.title])

            let data: any = {
                title: title,
                body: body,
                idType: userLink.fence.fenceId,
                userUid: u.uid,
                monitoredUid: u.uid,
                priority: userLink.fence.insert.priority,
                type: notificationTypesString.fence
            }

            await testAlert(u, users[u.userLink.i], data);
        });


        it('Verificar se está dentro de cerca ' + u.update.name, async () => {
            let userLink = users[u.userLink.i];
            await testFenceStatus(u, userLink.fence.insert.location, fenceStatusString.inside);
        });

        it('Verificar alerta dentro de cerca ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let title = localeToTest.getToTest('text:fence.status.title', <cultureString>userLink.culture)
            let body = localeToTest.getToTest('text:fence.status.body.inside', <cultureString>userLink.culture)
            body = body.naming(userLink.userLink.alias);
            body = body.stringFormat([userLink.fence.insert.title])

            let data: any = {
                title: title,
                body: body,
                idType: userLink.fence.fenceId,
                userUid: u.uid,
                monitoredUid: u.uid,
                priority: userLink.fence.insert.priority,
                type: notificationTypesString.fence
            }

            await testAlert(u, users[u.userLink.i], data);
        });


        it('Verificar se está perto de cerca, após entrar ' + u.update.name, async () => {
            let userLink = users[u.userLink.i];
            let near = nearCalculate(userLink.fence.insert.location.lat, userLink.fence.insert.location.lng, userLink.fence.insert.radius);
            await testFenceStatus(u, near, fenceStatusString.near);
        });

        it('Verificar se está fora de cerca ' + u.update.name, async () => {
            await testFenceStatus(u, { lat: 0, lng: 0 }, fenceStatusString.outside);
        });

        it('Verificar alerta fora de cerca ' + u.update.name, async () => {

            let userLink = users[u.userLink.i];

            let title = localeToTest.getToTest('text:fence.status.title', <cultureString>userLink.culture)
            let body = localeToTest.getToTest('text:fence.status.body.outside', <cultureString>userLink.culture)
            body = body.naming(userLink.userLink.alias);
            body = body.stringFormat([userLink.fence.insert.title])

            let data: any = {
                title: title,
                body: body,
                idType: userLink.fence.fenceId,
                userUid: u.uid,
                monitoredUid: u.uid,
                priority: userLink.fence.insert.priority,
                type: notificationTypesString.fence
            }

            await testAlert(u, users[u.userLink.i], data);
        });


    }

});

describe('Monitoramento - Exclusão de associações', async () => {

    for (let u of users) {

        it('Deletar associação', async () => {
            let userLink = users[u.userLink.i];
            let headers = header(u);
            await httpHelper['delete'](configTest.url + '/restricted/monitoring/monitorable/' + userLink.uid, headers);
            assert.isOk('Associação deletada com sucesso')
        });

        it('Verificação de exclusão de associação no MongoDb ', async () => {

            let user = await userModelById(u.uid);

            expect(user).to.be.not.null;

            if (user) {
                let userLink = users[u.userLink.i];
                expect(user.monitoring.users[0].active).to.be.false;
                expect(user.monitoring.users[0].userUid).to.be.equal(userLink.uid);
            }

        });

        it('Verificação de exclusão de associação (permissão) no MongoDb ', async () => {

            let userLink = users[u.userLink.i];

            let user = await userModelById(userLink.uid);

            expect(user).to.be.not.null;

            if (user) {
                expect(user.monitoring.allowed).to.be.empty;
            }

        });

        it('Verificação de exclusão de associação nas cercas virtuais ', async () => {

            let fence = await fenceModelById(u.fence.fenceId)
            expect(fence).to.be.not.null;

            if (fence) {
                expect(fence.monitored).to.be.empty;
            }

        });

        it('Verificação de exclusão de associação no Firebase ', async () => {

            let userLink = users[u.userLink.i];

            let user = await userFirebaseByUid(userLink.uid)

            expect(user).to.be.not.null;

            if (user) {
                expect(user.authorized).to.be.undefined;
            }

        });

    }

});

describe('Pagamento requerido', async () => {

    it('Obtem device', async () => {
        await inactivateAccount(userA);
        await paymentoRequiredTest(userA, 'get', '/restricted/device/' + userA.device.smartphoneId)
    });

    it('Atualizar device', async () => {
        await paymentoRequiredTest(userA, 'put', '/restricted/device/smartphone/' + userA.device.smartphoneId)
    });

    it('Deletar device', async () => {
        await paymentoRequiredTest(userA, 'delete', '/restricted/device/' + userA.device.smartphoneId)
    });

    it('Criar cerca ', async () => {
        await paymentoRequiredTest(userA, 'post', '/restricted/fence')
    });

    it('Atualizar cerca ', async () => {
        await paymentoRequiredTest(userA, 'put', '/restricted/fence/' + userA.fence.fenceId);
    });

    it('Deletar cerca ', async () => {
        await paymentoRequiredTest(userA, 'delete', '/restricted/fence/' + userA.fence.fenceId);
    });

    it('Obtem cerca ', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/fence/' + userA.fence.fenceId);
    });

    it('Todas as cercas ', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/fences')
    });

    it('Obtem código de solicitação ', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/monitoring/code')
    });

    it('Criar código de solicitação ', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/monitoring/refreshcode')
    });

    it('Alterar dados do monitorado ', async () => {
        await paymentoRequiredTest(userA, 'put', '/restricted/monitoring/monitorable/' + userB.uid)
    });

    it('Obter todos unselected ', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/monitoring/unselected')
    });

    it('Deletar monitorado ', async () => {
        await paymentoRequiredTest(userA, 'delete', '/restricted/monitoring/monitorable/' + userB.uid)
    });

    it('Tornar selecionado ', async () => {
        await paymentoRequiredTest(userA, 'put', '/restricted/monitoring/selected/' + userB.uid)
    });

    it('Tornar selecionado ', async () => {
        await paymentoRequiredTest(userA, 'put', '/restricted/monitoring/selected/' + userB.uid)
    });

    it('Obtem selecionado para o mapa', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/monitoring/selected-to-map')
    });

    it('Obtem selecionado para a conta', async () => {
        await paymentoRequiredTest(userA, 'get', '/restricted/monitoring/selected-to-account')
    });

    it('Deletar selecionado ', async () => {
        await paymentoRequiredTest(userA, 'delete', '/restricted/monitoring/selected/' + userB.uid)
    });
});


if (testModeFull) {

    describe('Clima', async () => {

        for (let u of users) {

            if (u.test) {

                it('Verificar se dentro de cerca', async () => {

                    return new Promise(async (resolve, reject) => {

                        let alert = await weatherAlertModelOne();

                        if (alert) {

                            let location = alert.polygon.coordinates[0][0];

                            let data = {
                                "type": "",
                                "lat": location[0],
                                "lng": location[1],
                                "altitude": 0,
                                "speed": 0,
                                "accuracy": 0
                            };

                            await updateLocation(data, u);

                            setTimeout(async () => {

                                let user = await userModelById(u.uid);

                                if (user && user.weatherAlert) {
                                    resolve();
                                }
                                else {
                                    reject('weatherAlert é falso');
                                }

                            }, configTest.waitingToTriggerSeconds * 1000);
                        }
                        else {
                            assert.isOk("Não há cerca de clima")
                        }
                    });
                });

                it('Verificar se fora de cerca', async () => {

                    return new Promise(async (resolve, reject) => {

                        let data = {
                            "type": "",
                            "lat": 0,
                            "lng": 0,
                            "altitude": 0,
                            "speed": 0,
                            "accuracy": 0
                        };

                        await updateLocation(data, u);

                        setTimeout(async () => {

                            let user = await userModelById(u.uid);

                            if (user && user.weatherAlert) {
                                reject('weatherAlert é verdadeiro');
                            }
                            else {
                                resolve();
                            }

                        }, configTest.waitingToTriggerSeconds * 1000);
                    });
                });
            }
        }
    });
}


describe('Push', async () => {
    it('Queue', async () => {
        let queues = notificationParser.generic("bTORvUDdXAMnMzRydkLbbbveVyq1", "Teste de push", "Push gerado pelo test de api", 0, notificationTypesString.test, 0, userA.uid);
        for (let queue of queues) {
            await httpHelper['post'](configTest.url + '/private/push/queue', queue);
        }
        assert.isOk('Associação deletada com sucesso')
    });
});


describe('Dados de teste', async () => {

    it('Limpar...', async () => {

        for (let u of users) {

            await firebase.auth().signInWithEmailAndPassword(u.update.email, u.update.password);

            var user = firebase.auth().currentUser;

            if (user) {
                await user.delete();
            }

            await firebaseAdmin.database().ref('users').child(u.uid).set(null);

            await firebaseAdmin.database().ref('alerts').child(u.uid).set(null);

            await userSchema.deleteOne({ _id: u.uid });

            await deviceSchema.deleteMany({ userUid: u.uid });

            await firebaseAdmin.database().ref('devices').child(u.device.smartphoneId).set(null);

            await monitoringCodeSchema.deleteMany({ userUid: u.uid })

            await fenceSchema.deleteMany({ userUid: u.uid });

            await locationHistorySchema.deleteMany({ _id: u.uid });

            await historySchema.deleteMany({ _id: u.uid });
        }

    });

});


