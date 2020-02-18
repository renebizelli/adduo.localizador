import userFirebase from "./user.firebase";
import storageFirebase from "./storage.firebase";
import sessionFirebase from "./session.firebase";
import locationFirebase from "./location.firebase";
import monitoringAllowanceFirebase from "./monitoring-allowance.firebase";
import pushFirebase from "./push.firebase";
import alertFirebase from "./alert.firebase";
import emailFirebase from "./email.firebase";

class firebaseFactory {

    static user() {
        return new userFirebase();
    }

    static storage() {
        return new storageFirebase()
    }

    static session() {
        return new sessionFirebase();
    }

    static location() {
        return new locationFirebase();
    }

    static monitoringAllowance() {
        return new monitoringAllowanceFirebase();
    }

    static push() {
        return new pushFirebase();
    }

    static alert() {
        return new alertFirebase();
    }

    static email() {
        return new emailFirebase();
    }
}

export default firebaseFactory;