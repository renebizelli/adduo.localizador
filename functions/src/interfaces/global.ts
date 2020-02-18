declare namespace NodeJS {
    interface Global {
        locales: any,
        config: {
            version: string,
            api: any,
            fence: any,
            google: {
                storage: any
            },
            weatherAlert: any,
            location: any,
            storage: any,
            monitoring: any,
            env: string,
            envAbrev: string
        }
    }
}

