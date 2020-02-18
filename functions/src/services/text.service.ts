import baseService from "./base.service";
import mongoFactory from "../mongo/mongo.factory";
import requestContextDto from "../dto/request-context.dto";

class textService extends baseService {

    private _textMongo = mongoFactory.text();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    one = async (id:string) => {
        return this._textMongo.one(id, this._context.culture);
    }

}

export default textService;