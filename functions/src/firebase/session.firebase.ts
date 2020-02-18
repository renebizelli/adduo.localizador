import * as firebase from 'firebase';
import * as firebaseAdmin from 'firebase-admin';

import firebaseHelper from '../helpers/firebase.helper';
import httpStatusHelper from '../helpers/http-status.helper';
import firebaseToDto from '../parsers/firebase-to-dto.parser';
import baseFirebase from './base.firebase';
import sessionPasswordCodeDto from '../dto/session-password-code.dto';

class sessionFirebase extends baseFirebase {

    authentication = async (email: string, password: string) => {

        let userRecord = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);

        if (!userRecord || !userRecord.user) {
            throw 'error:user.notfound';
        }

        return firebaseToDto.userInfoToSignin(userRecord);

    }

    verifyIdToken = async (token: string) => {

        try {

            let decodedToken = await firebaseAdmin
                .auth()
                .verifyIdToken(token, true);

            if (!decodedToken) {
                throw httpStatusHelper.unauthorized('');
            }

            return decodedToken
        }
        catch (error) {
            throw firebaseHelper.parserErrorToHttpStatus(error);
        }

    }

    sendPasswordResetEmail = async (email: string) => {
        return firebase
            .auth()
            .sendPasswordResetEmail(email);
    }

    validateCode = async (dto: sessionPasswordCodeDto) => {
        return firebase
            .auth()
            .verifyPasswordResetCode(dto.code);
    }

    changePassword = async (dto: sessionPasswordCodeDto) => {
        return firebase
            .auth()
            .confirmPasswordReset(dto.code, dto.password);
    }


}

export default sessionFirebase;