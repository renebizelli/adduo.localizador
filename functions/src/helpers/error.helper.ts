import errorDto from "../dto/error.dto";

class errorHelper {

    static factory(
        status: number,
        code?: string,
        message?: string,
        error?: any,
        stack?: string): errorDto {

        return new errorDto(status, code, message, error, stack)
    }

}

export default errorHelper;