import baseDto from "./base.dto";
import { productTypesString } from "../enum/product.enum";

class productDto extends baseDto {
    public sku: string = '';
    public description: string = '';
    public title: string = '';
    public purchased: boolean = false;
    public numberOfLicenses: number = 0;
    public type: productTypesString = productTypesString.none;
}

export default productDto