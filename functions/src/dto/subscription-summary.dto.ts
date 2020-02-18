import baseDto from "./base.dto";
import { subscriptionStatusString } from "../enum/subscription.enum";

class subscriptionSummaryDto extends baseDto {
    public statusEnum: subscriptionStatusString = subscriptionStatusString.pending;
    public status: string = '';
    public active: boolean = false;
    public numberOfLicenses: number = 0;
    public sku: string = '';
    public title: string = '';
    public needsToFix: boolean = false;
    public isFree: boolean = false;
    public subscriptionType: string = '';
    public description: string = '';
    public daysLeft: number = 0;
    public expiryTime: number = 0;
    public isProcessing: boolean = false;

}

export default subscriptionSummaryDto;