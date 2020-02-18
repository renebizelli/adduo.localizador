import firebaseFactory from "../firebase/firebase.factory";
import mongoFactory from "../mongo/mongo.factory";

class locationBaseService {

    constructor() {}

    public _locationFirebase = firebaseFactory.location();
    public _locationHistoryMongo = mongoFactory.locationHistory();

    public cl(title: string, o: any = {}): void {
        console.log(">>>>> ", title, JSON.stringify(o));
    }

}

export default locationBaseService;