import * as firebaseAdmin from 'firebase-admin';

import { changingTypesString } from '../enum/changing.enum';

import firebaseHelper from "../helpers/firebase.helper";
import stringHelper from '../helpers/string.helper';
import timeStampHelper from '../helpers/timestamp.helper';
import userDto from '../dto/user.dto';
import firebaseToDto from '../parsers/firebase-to-dto.parser';
import baseFirebase from './base.firebase';
import dtoToFirebaseParser from '../parsers/dto-to-firebase.parser';

class userFirebase extends baseFirebase {

    private _parser(userDto: userDto) {

        let name = stringHelper.captalize(userDto.name || '');

        name = name.replace(' De ', ' de ')
        name = name.replace(' Da ', ' da ')
        name = name.replace(' A ', ' a ')
        name = name.replace(' O ', ' o ')
        name = name.replace(' E ', ' e ')

        let user: firebaseAdmin.auth.CreateRequest = {
            email: userDto.email,
            displayName: name,
            password: userDto.password
        };

        if (userDto.phone) {
            user.phoneNumber = stringHelper.completePhone(userDto.phone);
        }

        return user;
    }

    create = async (userDto: userDto) => {

        try {

            let newUser = this._parser(userDto);

            let userRecord = await firebaseAdmin
                .auth()
                .createUser(newUser);

            return userRecord;
        }
        catch (error) {
            throw firebaseHelper.parserErrorToHttpStatus(error);
        }

    }

    init = async (user: userDto) => {

        let path = "/users/{0}/".stringFormat([user.uid]);
        let o = dtoToFirebaseParser.toUser();
        await firebaseAdmin
            .database()
            .ref(path)
            .set(o);

    }

    update = async (userDto: userDto) => {

        try {

            let newUser = this._parser(userDto);

            let userRecord = await firebaseAdmin
                .auth()
                .updateUser(userDto.uid, newUser);

            let dto = firebaseToDto.userRecordToUser(userRecord);

            return dto;
        }
        catch (error) {

            throw firebaseHelper.parserErrorToHttpStatus(error);
        }

    }

    delete = async (uid: string) => {
        await firebaseAdmin.database().ref('users').child(uid).set(null);
        await firebaseAdmin.auth().deleteUser(uid);
    }

    get = async (uid: string) => {
        let userRecord = await firebaseAdmin.auth().getUser(uid);

        let dto = firebaseToDto.userRecordToUser(userRecord);

        return dto;
    }

    changing = async (uid: string, type: changingTypesString, value?: string) => {

        let valueToSet = value || timeStampHelper.get();

        let path = "/users/{0}/changing/{1}".stringFormat([uid, type]);

        return firebaseAdmin
            .database()
            .ref(path)
            .set(valueToSet);

    }


}

export default userFirebase;