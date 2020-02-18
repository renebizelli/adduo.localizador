import baseMongo from './base.mongo';
import productSchema from '../models/product.schema';
import modelToDtoParser from '../parsers/model-to-dto.parser';

class productMongo extends baseMongo {

    storeOne = async (culture: string) => {
        let model = await this.findById("store", { ['data.' + culture]: 1 });

        if (model) {
            return modelToDtoParser.store(model, culture)
        }

        return
    }

    homeOne = async (culture: string) => {
        let model = await this.findById("home", { ['data.' + culture]: 1 });
        return model && model.data;
    }

    private findById = async (id: string, projection?: any) => {
        return productSchema.findById(id, projection);
    }

}

export default productMongo;