import receiptDto from "./receipt.dto";

class receiptToAdminDto extends receiptDto {
    public name: string = '';
    public email: string = '';
}

export default receiptToAdminDto;