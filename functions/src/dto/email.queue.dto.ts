import baseDto from "./base.dto";

class emailQueueDto
    extends baseDto {

    public key: string = '';

    constructor(
        public name: string,
        public email: string,
        public title: string,
        public message: string,
    ) {
        super()
    }
}

export default emailQueueDto;