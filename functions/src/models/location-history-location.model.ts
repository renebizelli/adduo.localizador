interface locationHistoryLocationModel {
    location: {
        type: string,
        coordinates: number[]        
    },
    altitude: number,
    deviceId: string,
    speed: number,
    accuracy: number,
    occurredAt: number
}

export default locationHistoryLocationModel;