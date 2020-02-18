import baseDto from "./base.dto";
import { platformsString } from "../enum/platform.enum";

class receiptDto extends baseDto {
    public transactionId: string = '';
    public uid: string = '';
    public platform: platformsString = platformsString.none;
    public data: any = null;
    public tryToSend: number = 0;
    public error: any[] = [];
}

export default receiptDto;