import * as firebaseAdmin from 'firebase-admin'
import setupDto from "../dto/setup.dto";
import locationDto from '../dto/location.dto';
import dtoToFirebase from '../parsers/dto-to-firebase.parser';
import dtoToFirebaseParser from '../parsers/dto-to-firebase.parser';
import timeStampHelper from '../helpers/timestamp.helper';
import { timestampPart } from '../enum/timestamp.enum';
import baseFirebase from './base.firebase';
import firebaseToDto from '../parsers/firebase-to-dto.parser';

class locationFirebase extends baseFirebase {
 
    setup = async (_setup: setupDto) => {

        let o = dtoToFirebase.toLocation(_setup.uid);

        return firebaseAdmin
            .database()
            .ref("devices")
            .child(_setup.deviceId)
            .set(o);

    }

    updateLocation = async (dto: locationDto) => {

        return firebaseAdmin
            .database()
            .ref('devices')
            .child(dto.deviceId)
            .child('location')
            .transaction((current) => {

                if (current) {

                    current.updatedAt = current.updatedAt || 0;

                    let valid = this._validateForTransaction(current.updatedAt, dto.updatedAt);

                    if (valid) {
                        return dtoToFirebaseParser.dtoToLocation(dto);
                    } else {
                        return current
                    }

                } else {
                    return current
                }

            }, () => { }, false);

    }

    updateRoot = async (dto: locationDto) => {

        return firebaseAdmin
            .database()
            .ref('devices')
            .child(dto.deviceId)
            .transaction((current) => {
                if (current) {

                    current.updatedAt = current.updatedAt || 0;

                    let valid = this._validateForTransaction(current.updatedAt, dto.updatedAt);

                    if (valid) {
                        dto.uid = current.userUid;
                        return dtoToFirebaseParser.dtoToRoot(dto);
                    } else {
                        return current
                    }

                } else {
                    return current
                }

            }, () => { }, false);

    }

    updateParams = async (dto: locationDto) => {

        return firebaseAdmin
            .database()
            .ref('devices')
            .child(dto.deviceId)
            .child('params')
            .transaction((current) => {
                if (current) {
                    dto.accuracyState = dto.accuracyState || current.accuracyState;
                    return dtoToFirebaseParser.dtoToParams(dto);
                } else {
                    return current
                }

            }, () => { }, false);


    }

    one = async (deviceId: string) => {

        let model = (await firebaseAdmin
            .database()
            .ref('devices')
            .child(deviceId)
            .once('value')).val();

        let dto = firebaseToDto.location(model);

        return dto;
    }

    private _validateForTransaction(currentUpdatedAt: number, newUpdatedAt: number): boolean {

        let minimumAllowedTimeForUpdateLocation = parseInt(global.config.location.minimumAllowedTimeForUpdateLocation);

        let seconds = timeStampHelper.diff(newUpdatedAt, currentUpdatedAt, timestampPart.seconds);

        return seconds > minimumAllowedTimeForUpdateLocation;
    }



    delete = async (deviceId: string) => {

        return firebaseAdmin
            .database()
            .ref('devices')
            .child(deviceId)
            .set(null);

    }


}

export default locationFirebase;