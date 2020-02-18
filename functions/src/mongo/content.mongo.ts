import baseMongo from "./base.mongo";
import contentSchema from "../models/content.schema";

class constantMongo extends baseMongo {

    getOne = async <T>(id: string) => {
        let constant = await this._findOne({ _id: id });

        if (constant) {
            return <T>constant.data
        }

        return;
    }

    private _findOne = async (query: any) => {
        return contentSchema.findOne(query, { data: 1 });
    }

}

export default constantMongo;