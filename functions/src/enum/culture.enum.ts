import enumHelper from "../helpers/enum.helper";

export enum cultureString {
    en = 'en',
    pt = 'pt'
}

class cultureEnum {

    private static _cultures: cultureString[] = [
        cultureString.en,
        cultureString.pt
    ];

    static cultures(): cultureString[] {
        return this._cultures;
    }

    static culture(): cultureString {
        return cultureString.pt;
    }

    static cultureString() {
        return this.culture().toString();
    }

    static contains(l: any): boolean {

        let contains = enumHelper.contains<cultureString>(l.toString(), this._cultures);

        return contains;
    }

}


export default cultureEnum;

