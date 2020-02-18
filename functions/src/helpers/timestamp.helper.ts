import { timestampPart } from "../enum/timestamp.enum";
import datetimeHelper from "./datetime-helper";

class timeStampHelper {

    static diffNow = (ts: number, part: timestampPart) => {
        return timeStampHelper.diff(timeStampHelper.get(), ts, part);
    }

    static diff = (ts1: number, ts2: number, part: timestampPart) => {

        let _diff = ts1 - ts2;

        let result = 0;

        if (part == timestampPart.minutes) {
            result = Math.floor(_diff / 1000 / 60);
        }
        else if (part == timestampPart.seconds) {
            result = Math.floor(_diff / 1000);
        }
        else if (part == timestampPart.days) {
            result = Math.floor(_diff / timeStampHelper.oneDay());
        }

        return result;
    }

    static oneDay = () => {
        return 86400000;
    }

    static addDays = (ts: number, days: number) => {
        return ts + (days * timeStampHelper.oneDay());
    }

    static get = () => {
        return datetimeHelper.now().getTime();
    }

    static getString = () => {
        return timeStampHelper.get().toString();
    }

    static toDatetime = (t: number, fator: number = 1) => {
        return new Date(t * fator);
    }

    static convertDateString(date: string): number {
        let d = new Date(date);
        return d.getTime();
    }

    static convertTicks(ticks: number): number {
        //ticks are in nanotime; convert to microtime
        var ticksToMicrotime = ticks / 10000;
        //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
        var epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));

        return ticksToMicrotime - epochMicrotimeDiff;
    }

    static convertDatetime(datetime: string): number {
        let result = 0;
        if (datetime) {
            result = (new Date(datetime)).getTime();
        }

        return result
    }

}

export default timeStampHelper;