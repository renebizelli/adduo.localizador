import baseMongo from './base.mongo';
import weatherAlertSchema from '../models/weather-alert.schema';
import anyToModelParser from '../parsers/any-to-model.parser';
import geoPointDto from '../dto/geo-point.dto';
import modelToDtoParser from '../parsers/model-to-dto.parser';

class weatherAlertMongo extends baseMongo {

    save = async (detail: any) => {

        let model = anyToModelParser.weatherAlert(detail);

        return this._save(model);
    }

    deleteMany = async () => {
        return this._deleteMany();
    }

    checkInside = async (geo: geoPointDto) => {

        let query = {
            "polygon": {
                "$geoIntersects": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [geo.lat, geo.lng]
                    }
                }
            }
        };

        let model = await this._findOne(query);

        if (model) {
            return modelToDtoParser.weatherAlert(model);
        }

        return;
    }

    private _deleteMany = async () => {
        await weatherAlertSchema.deleteMany({});
    }

    private _save = async (o: any) => {
        try {
            await (new weatherAlertSchema(o)).save();
        }
        catch (error) {
            console.log("error save polygon", error._id)
        }
    }

    private _findOne(query: any, projection?: any) {
        return weatherAlertSchema.findOne(query, projection);
    }
}

export default weatherAlertMongo;