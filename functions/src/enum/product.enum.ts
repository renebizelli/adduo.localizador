import enumHelper from "../helpers/enum.helper";

export enum productEnumString {
    free = 'br.com.nextterdigital.foxtter.free',
    vip = 'br.com.nextterdigital.foxtter.vip'
}

export enum productTypesString {
    none = "none",
    monthly = "monthly",
    yearly = "yearly"
}

class productEnum {

    private static _types: productTypesString[] = [
        productTypesString.monthly,
        productTypesString.yearly,
    ];

    static types(): productTypesString[] {
        return this._types;
    }

    static containType(l: any): boolean {
        let contains = enumHelper.contains<productTypesString>(l, this._types);
        return contains;
    }

    static notContainPlatform(l: any): boolean {
        return !productEnum.containType(l);
    }
}

export default productEnum;