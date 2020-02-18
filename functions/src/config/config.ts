import '../prototypes/string.prototype';

import firebaseConfigDto from '../dto/config/firebase-config.dto';

import * as adminConfig from './admin.config.json'


class config {

    private static fbConfig: firebaseConfigDto = <firebaseConfigDto>JSON.parse(process.env.FIREBASE_CONFIG || '');

    static env() {
        return this.fbConfig.projectId;
    }

    static adminConfig() {
        let e = this.fbConfig.projectId;
        return (<any>adminConfig)[e];
    }

    static envAbrev() {
        let e = '';

        if (config.env() === 'nextter-38532') {
            e = 'dev'
        }
        else if (config.env() === 'nextter-homologacao') {
            e = 'hom'
        }

        return e;
    }


}

export default config;