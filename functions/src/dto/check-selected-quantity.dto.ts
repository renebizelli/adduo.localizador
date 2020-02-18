import baseDto from "./base.dto";

class checkSelectedQuantityDto extends baseDto {
    public sku: string = '';
    public numberOfLicenses: number = 0;
    public usedLicenses: number = 0;
}

export default checkSelectedQuantityDto;

