class debugHelper {

    static addEnvAbrev(text:string) 
    {
        let e = text;

        if(global.config.envAbrev) 
        {
            e = e + '   (' + global.config.envAbrev + ')'
        }

        return e;
    }

}

export default debugHelper;