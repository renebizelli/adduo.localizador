import * as mongoose from 'mongoose';
import { fenceStatusString } from '../enum/fence.enum';

interface fenceMonitoredModel
    extends mongoose.Document {
    uid: string,
    status: fenceStatusString,
    createdAt?: number,
    updatedAt?: number
}

export default fenceMonitoredModel;
