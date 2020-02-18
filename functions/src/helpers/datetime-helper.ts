class datetimeHelper {

    static now() {
        return new Date();
    }

    static time()  {
        let d = datetimeHelper.now();
        return d.getHours() + ':' + d.getMinutes();
    }    


}

export default datetimeHelper;