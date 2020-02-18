export enum notificationTypesString {
    none = '',
    fence = 'fence',
    accept = 'accept',
    blockedUser = 'blocked-user',
    weatherAlert = 'weather',
    countdownFreeUser = 'countdown-free-user',
    test = 'test'
}

class notificationEnum {

    static types(): notificationTypesString[] {

        return [
            notificationTypesString.fence,
            notificationTypesString.accept,
            notificationTypesString.blockedUser,
            notificationTypesString.countdownFreeUser
        ]

    }
}

export default notificationEnum;