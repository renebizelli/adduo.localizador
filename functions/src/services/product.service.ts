import baseService from './base.service';
import mongoFactory from '../mongo/mongo.factory';
import requestContextDto from '../dto/request-context.dto';
import serviceFactory from './service.factory';
import productDto from '../dto/product.dto';

class productService extends baseService {

    public _productMongo = mongoFactory.product();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    storeOne = async () => {
        let dto = await this._productMongo.storeOne(this._context.culture);

        await this._markPurchased(dto);

        return dto;
    }

    private _markPurchased = async (dto: any) => {

        let subscriptionService = serviceFactory.subscription(this._context);

        let subscription = await subscriptionService.one();

        if (subscription.active) {

            for (let type in dto) {

                let current = dto[type].filter((item: productDto) => {
                    return item.sku == subscription.sku
                });

                if (current.length) {
                    current[0].purchased = true;
                    break;
                }
            }
        }

    }

    homeOne = async () => {
        let source = await this._productMongo.homeOne(this._context.culture);

        this.cl(source)

        let store = source[this._context.culture];
        return store;
    }

}

export default productService;