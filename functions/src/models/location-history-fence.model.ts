import { fenceStatusString } from "../enum/fence.enum";

interface locationHistoryFenceModel   {
    location: {
        type: string,
        coordinates: number[]        
    },
    fenceId: string,
    deviceId: string,
    status: fenceStatusString,
    occurredAt: number
}

export default locationHistoryFenceModel;