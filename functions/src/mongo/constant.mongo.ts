import baseMongo from "./base.mongo";
import constantSchema from "../models/constant.schema";

class constantMongo extends baseMongo {

    getOne = async (id: string) => {
        let constant = await this._findOne({ _id: id });

        if (constant) {
            return constant.data
        }

        return;
    }

    private _findOne = async (query: any) => {
        return constantSchema.findOne(query, { data: 1 });
    }

}

export default constantMongo;