export enum historyTypeEnum {
    none = 'none',
    user = 'user',
    fence = 'fence',
    monitoring = 'monitoring',
    monitorable = 'monitorable',
    selected = 'selected',
    subscription = 'subscription',
    receipt = 'receipt',
    requestcode = 'request-code',
    deviceSmartphone = 'device-smartphone',
    deviceIot = 'device-iot',
    device = 'device',
    session = 'session',
    content = 'content',
    alert = 'alert',
    location = 'location',
    product = 'product',
    push = 'push',
    text = 'text',
    weather = 'weather',
    notification = 'notification',
    fenceCheck = 'fence-check',
    email = 'email'

}

class historyEnum {

    static types(): historyTypeEnum[] {

        return [
            historyTypeEnum.user,
            historyTypeEnum.fence,
            historyTypeEnum.monitoring,
            historyTypeEnum.monitorable,
            historyTypeEnum.selected,
            historyTypeEnum.subscription,
            historyTypeEnum.receipt,
            historyTypeEnum.requestcode,
            historyTypeEnum.deviceSmartphone,
            historyTypeEnum.deviceIot,
            historyTypeEnum.session,
            historyTypeEnum.content
        ];

    }
}

export default historyEnum;