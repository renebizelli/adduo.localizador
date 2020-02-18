import baseMongo from "./base.mongo";
import textSchema from '../models/text.schema';
import modelToDtoParser from "../parsers/model-to-dto.parser";
import { cultureString } from "../enum/culture.enum";

class textMongo extends baseMongo {


    one = async (id: string, culture:cultureString) => {

        let model = await this._findOne({ _id: id });

        let dto = modelToDtoParser.text(model, culture);

        return dto;
    }


    private _findOne = async (query: any, projection?: any) => {
        return textSchema.findOne(query, projection);
    }


}

export default textMongo;