import baseDto from "./base.dto";
import productDto from "./product.dto";

class subscriptionUpdateDto extends baseDto {
    public uid: string = '';
    public transactionId: string = '';
    public subscriptionId: string = '';
    public active: boolean = false;
    public lastStatus: number = 0;
    public startTime: number = 0;
    public expiryTime: number = 0;
    public resumeTime: number = 0;
    public product: productDto = new productDto();
}

export default subscriptionUpdateDto;