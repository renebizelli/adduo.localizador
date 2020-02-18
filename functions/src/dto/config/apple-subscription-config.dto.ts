class appleSubscriptionConfigDto {
    public receiptValidation: appleSubscriptionReceiptValidationConfigDto = new appleSubscriptionReceiptValidationConfigDto();
}

class appleSubscriptionReceiptValidationConfigDto {
    public url: string = '';
    public statusCodeRetryable: string = '';
}

export default appleSubscriptionConfigDto;