import * as firebaseAdmin from 'firebase-admin';
import baseFirebase from "./base.firebase";
import emailQueueDto from "../dto/email.queue.dto";

class emailFirebase extends baseFirebase {

    queue = async (email: emailQueueDto) => {

        return firebaseAdmin
            .database()
            .ref('emails')
            .push(email);
    }


    delete = async (key: string) => {

        return firebaseAdmin
            .database()
            .ref('emails/' + key).set(null);

    }    

}

export default emailFirebase;