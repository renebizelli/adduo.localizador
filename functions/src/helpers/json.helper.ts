import * as xml2js from 'xml2js';

class jsonHelper {

    static clearEmpty = (o: any) => {
        Object.keys(o).forEach((k) => (!o[k] && o[k] !== undefined) && delete o[k]);
        return o;
    }

    static convertByXml(xml:any) {

        return new Promise((resolve, reject) => {

            xml2js.parseString(xml, (error: any, json: any) => {

                if (error) {
                    reject(error)
                }
                else {
                    resolve(json);
                }
            });
        });

    }


}

export default jsonHelper;