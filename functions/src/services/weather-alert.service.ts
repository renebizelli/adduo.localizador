import httpHelper from "../helpers/http.helper";
import logService from "./log.service";
import jsonHelper from "../helpers/json.helper";
import datetimeHelper from "../helpers/datetime-helper";
import mongoFactory from "../mongo/mongo.factory";
import { historyTypeEnum } from "../enum/history.enum";

class weatherAlertService {

    private _weatherAlertMongo = mongoFactory.weatherAlert();



    load = async () => {

        try {

            let source = await this._requestSource();

            let items = this._filterItems(source);

            let details = await this._requestItemsDetails(items);

            await this._weatherAlertMongo.deleteMany();

            for (let detail of details) {
                await this._weatherAlertMongo.save(detail);
            }
        }
        catch (error) {
            logService.logServiceError(historyTypeEnum.weather, '0', error, '', '"weatherAlertService.load()');
        }
    }

    private _requestSource = async () => {

        let xml: any = await httpHelper.getXml(global.config.weatherAlert.uri)

        return jsonHelper.convertByXml(xml);
    }

    private _filterItems(source: any): any[] {

        let items = <any[]>source.rss.channel[0].item;

        return items.filter((e: any) => {
            return /^Aviso de Tempestade.+$/.test(e.title) ||
                /^Acumulado de Chuva.+$/.test(e.title) ||
                /^Aviso de Chuvas Intensas.+$/.test(e.title);

        });
    }

    private _requestItemsDetails = async (items: any[]) => {

        let details: any[] = []

        for (let item of items) {

            let xml = await httpHelper.getXml(item.link[0]);

            let detail = await jsonHelper.convertByXml(xml);

            if (this._validateItemDetail(detail)) {
                details.push(detail);
            }
        }

        return details;
    }

    private _validateItemDetail(detail: any) {
        return new Date(detail.alert.info[0].expires[0]) > datetimeHelper.now();
    }


}

export default weatherAlertService;