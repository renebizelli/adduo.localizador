import baseParser from "./base.parser";
import countdownFreeUserParams from "../query-params/countdown-free-user.params";

class queryParamsParser extends baseParser {

    static toCountdownFreeUser(dayLeft: number, ts: number, constantDay: number, communicationId: string, freeSkuProduct: string) {

        return <countdownFreeUserParams>{
            daysTarget: dayLeft,
            ts: ts,
            constantDay: constantDay,
            communicationId: communicationId,
            freeSkuProduct: freeSkuProduct
        }
    }

}

export default queryParamsParser;