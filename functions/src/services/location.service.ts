import baseService from "./base.service";

import requestContextDto from "../dto/request-context.dto";
import setupDto from "../dto/setup.dto";

import firebaseFactory from "../firebase/firebase.factory";

class locationService extends baseService {

    private _locationFirebase = firebaseFactory.location();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    setup = async (setup: setupDto) => {
        return this._locationFirebase.setup(setup);
    }
  

    static delete = async (devideId: string) => {
        let locationFirebase = firebaseFactory.location();
        return locationFirebase.delete(devideId);
    }

}

export default locationService;