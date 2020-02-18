import * as mongoose from 'mongoose';

class mongooseHelper {

    static toObjectId(id:string) {
        return new mongoose.Types.ObjectId(id.toString())
    }

    static parseToGeoPoint(lat:number, lng:number) {
        
    }


}

export default mongooseHelper;