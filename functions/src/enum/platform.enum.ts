import enumHelper from '../helpers/enum.helper';

export enum platformsString {
    none = 'none',
    apple = 'apple',
    google = 'google'
}

class platformEnum {

    private static _platforms: platformsString[] = [
        platformsString.apple,
        platformsString.google,
    ];

    static platforms(): platformsString[] {
        return this._platforms;
    }

    static containPlatform(l: any): boolean {
        let contains = enumHelper.contains<platformsString>(l, this._platforms);
        return contains;
    }

    static notContainPlatform(l: any): boolean {
        return !platformEnum.containPlatform(l);
    }
}

export default platformEnum;