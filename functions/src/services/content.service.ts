import mongoFactory from "../mongo/mongo.factory";
import contentBannerHomeDto from "../dto/content-banner-home.dto";
import { contentString } from "../enum/content.enum";
import deviceService from "./device.service";
import requestContextDto from "../dto/request-context.dto";
import { historyTypeEnum } from "../enum/history.enum";

class contentService extends deviceService {

    private _contentMongo = mongoFactory.content();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.content);
    }

    getBannerHome = async () => {
        return this._get<contentBannerHomeDto[]>(contentString.bannerHome)
    }

    private _get = async <T>(id: string) => {
        return await this._contentMongo.getOne<T>(id);
    }

}

export default contentService;