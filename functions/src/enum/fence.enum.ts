import enumHelper from "../helpers/enum.helper";

export enum fencePriority {
    critical = 1,
    normal = 8
}

export enum fenceStatusString {
    none = 'none',
    inside = 'inside',
    outside = 'outside',
    near = 'near'
}

class fenceEnum {

    private static _status: fenceStatusString[] = [
        fenceStatusString.none,
        fenceStatusString.inside,
        fenceStatusString.outside,
        fenceStatusString.near
    ];

    static status(): fenceStatusString[] {
        return this._status;
    }

    private static _fences: fencePriority[] = [
        fencePriority.normal,
        fencePriority.critical,
    ];

    static priorities(): fencePriority[] {
        return this._fences;
    }
   

    static containPriority(l: any): boolean {
        let contains = enumHelper.contains<fencePriority>(l, this._fences);
        return contains;
    }

    static notContainPriority(l: any): boolean {
        return !fenceEnum.containPriority(l);
    }

}

export default fenceEnum;
