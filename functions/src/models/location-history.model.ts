import locationHistoryLocationModel from "./location-history-location.model";
import locationHistoryFenceModel from "./location-history-fence.model";
import * as mongoose from 'mongoose';

interface locationHistoryModel
    extends mongoose.Document {
    _id: string,
    location: [locationHistoryLocationModel],
    fence: [locationHistoryFenceModel]

}

export default locationHistoryModel;