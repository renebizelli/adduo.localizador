import baseDto from "./base.dto";

class sessionDto
    extends baseDto {

    constructor(
        public token: string,
        public refresh: string,
        public ts: number = 0

    ) {
        super()
    }


}


export default sessionDto