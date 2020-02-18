export enum deviceTypesString {
    smartphone = 'smartphone',
    iot = 'iot'
}

export enum deviceStatusString {
    none = 'none',
    waiting = 'waiting',
    active = 'active',
    inactive = 'inactive',
    delete = 'delete'
}

class deviceEnum {

    static types(): deviceTypesString[] {
        return [
            deviceTypesString.smartphone,
            deviceTypesString.iot
        ]
    }

    static status(): deviceStatusString[] {
        return [
            deviceStatusString.waiting,
            deviceStatusString.active,
            deviceStatusString.inactive
        ]
    }
}

export default deviceEnum;