import { Storage } from '@google-cloud/storage';
import * as cert from '../config/google-cert.json';
import * as storage from '../config/storage.config.json';
import config from '../config/config';
import storageConfigDto from '../dto/config/storage.config.dto';
import baseFirebase from './base.firebase';

class storageFirebase extends baseFirebase {

    private _env: string = config.env();
    private _cert = (<any>cert)[this._env];
    private _storageEnv = <storageConfigDto>((<any>storage)[this._env]);

    fileFactory(uid: string) {

        let fileName = this._storageEnv.profile_folder + '/' + uid + '.jpg';

        let storage = new Storage({
            projectId: this._env,
            credentials: this._cert
        });

        let bucket = storage.bucket(this._storageEnv.bucket);

        return bucket.file(fileName);
    }

    photoDelete = async (uid: string) => {

        let file = this.fileFactory(uid);

        await file.delete();
    }
}

export default storageFirebase;