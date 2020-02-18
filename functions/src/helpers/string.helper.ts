class stringHelper {

    static generateCode = (size: number) => {

        return Math.random()
            .toString(36)
            .substring(2, size + 2)
            .toUpperCase();

    }

    static captalize(text:string) {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
    }

    static completePhone(text:string) {
        let phone = text.replace(/\+55/, '')
        phone = phone.replace(/\+/, '');
        return '+55' + phone;
    }

    
    static base64Process(base64:string) {
        return base64 && base64.replace(/^data:image\/\w+;base64,/, '');
    }

}


export default stringHelper;