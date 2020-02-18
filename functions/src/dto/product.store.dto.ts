import baseDto from "./base.dto";
import productDto from "./product.dto";

class productStoreDto extends baseDto {
    public monthly: productDto[] = []
    public yearly: productDto[] = []
}

export default productStoreDto;