import locationDto from "../dto/location.dto";

interface locationUpdateInterface {
    update(dto:locationDto) : Promise<any>;
    validate(dto:locationDto) : void;
}

export default locationUpdateInterface;