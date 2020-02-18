import * as firebase from 'firebase'
import * as firebaseAdmin from 'firebase-admin'

import baseParser from "./base.parser";
import signInDto from "../dto/signin.dto";
import sessionDto from "../dto/session.dto";
import userDto from "../dto/user.dto";
import locationDto from '../dto/location.dto';
import geoPointDto from '../dto/geo-point.dto';
import timeStampHelper from '../helpers/timestamp.helper';

class firebaseToDto extends baseParser {

    static async userInfoToSignin(userCredential: firebase.auth.UserCredential) {

        let sigin: signInDto = new signInDto();

        if (userCredential && userCredential.user) {

            sigin.user = new userDto();
            sigin.user.uid = userCredential.user.uid;
            sigin.user.name = userCredential.user.displayName || '';
            sigin.user.email = userCredential.user.email || '';
            sigin.user.phone = userCredential.user.phoneNumber || '';

            let token = await userCredential.user.getIdToken();

            sigin.session = new sessionDto(token, userCredential.user.refreshToken);

        }

        return sigin;
    }

    static userRecordToUser(userRecord: firebaseAdmin.auth.UserRecord) {

        let createdAt = timeStampHelper.convertDateString(userRecord.metadata.creationTime)

        let user = new userDto();
        user.uid = userRecord.uid;
        user.name = userRecord.displayName || '';
        user.email = userRecord.email || '';
        user.phone = userRecord.phoneNumber || '';
        user.createdAt = createdAt;

        return user;
    }


    static location(model: any): locationDto {

        return <locationDto>{
            uid: model.userUid,
            deviceId: model.key,
            location: <geoPointDto>{
                lat: model.location && parseFloat(model.location.lat),
                lng: model.location && parseFloat(model.location.lng)
            },
            direction: model.location && model.location.direction,
            altitude: model.location && model.location.altitude,
            speed: model.location && model.location.speed,
            accuracy: model.location && model.location.accuracy,
            updatedAt: model.location && model.location.updatedAt,
            battery: model.params && model.params.battery,
            accuracyState: model.params && model.params.accuracyState

        }
    }
}

export default firebaseToDto;