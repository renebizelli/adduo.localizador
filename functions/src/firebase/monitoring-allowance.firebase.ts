import * as firebaseAdmin from 'firebase-admin'
import baseFirebase from "./base.firebase";

class monitoringAllowanceFirebase extends baseFirebase {

    addAllowance = async (monitorableUid: string, allowdeUid: string, value: any) => {
        return firebaseAdmin
            .database()
            .ref("users/{0}/authorized/{1}".stringFormat([monitorableUid, allowdeUid]))
            .set(value);
    }

    removeAllowance = async (monitorableUid: string, allowdeUid: string) => {
        return firebaseAdmin
            .database()
            .ref("users/{0}/authorized/{1}".stringFormat([monitorableUid, allowdeUid]))
            .set(null);
    }


}

export default monitoringAllowanceFirebase;