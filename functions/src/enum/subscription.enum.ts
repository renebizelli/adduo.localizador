export enum receiptStatusString {
    waitForProcess = 'waitForProcess',
    processed = 'processed',
    error = 'error'

}

export enum subscriptionStatusString {
    pending = 0,
    active = 1,
    cancel = 2
}

class subscriptionEnum {

    static receiptStatus(): receiptStatusString[] {

        return [
            receiptStatusString.processed,
            receiptStatusString.waitForProcess
        ]

    }


    static subscriptionStatus(): subscriptionStatusString[] {

        return [
            subscriptionStatusString.pending,
            subscriptionStatusString.active,
            subscriptionStatusString.cancel
        ]

    }

}

export default subscriptionEnum;