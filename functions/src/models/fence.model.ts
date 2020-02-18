import * as mongoose from 'mongoose';
import fenceMonitoredModel from './fence-monitored.model';

interface fenceModel
    extends mongoose.Document {
    location: {
        type: string,
        coordinates: number[]
    },
    monitored: fenceMonitoredModel[]
    radius: number,
    priority: number,
    userUid: string,
    address: string,
    title: string,
    active: boolean,
    createdAt?: number
}

export default fenceModel;