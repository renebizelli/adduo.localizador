import * as mongoose from 'mongoose';

interface weatherAlertModel
    extends mongoose.Document {
    _id: string,
    expires: number,
    description: string,
    instruction: string[],
    event: string,
    urgency: string,
    severity: string,
    sender: string,
    code: string,
    createdAt: number,
    polygon: {
        type: string,
        coordinates: number[][][]
    },
}

export default weatherAlertModel;


