import baseParser from "./base.parser";
import weatherAlertModel from "../models/weather-alert.model";
import validatorHelper from "../helpers/validator.helper";
import timeStampHelper from "../helpers/timestamp.helper";

class anyToModelParser extends baseParser {

    static weatherAlert(detail: any): weatherAlertModel {

        let instruction = detail.alert.info[0].instruction[0].replace('\n', '');
        let instructions = instruction.split('*');
        instructions = instructions.filter((e: any) => {
            return validatorHelper.notNullOrEmpty(e)
        });

        let coords = detail.alert.info[0].area[0].polygon.toString().replace('\n', '').split(' ');

        let coordinates: number[][] = [];

        for (let i = 0; i < coords.length; i++) {

            let split = coords[i].toString().split(',');
            if (split.length == 2) {
                coordinates.push([parseFloat(split[0]), parseFloat(split[1])])
            }
        }

        let expires = (new Date(detail.alert.info[0].expires[0])).getTime();

        let code = detail.alert.info[0].event[0].toString().toLowerCase().replace(' ', '-')

        return <weatherAlertModel>{
            _id: detail.alert.identifier[0].toString(),
            expires: expires,
            polygon: {
                type: "Polygon",
                coordinates: [coordinates]
            },
            description: detail.alert.info[0].description[0],
            instruction: instructions,
            event: detail.alert.info[0].event[0],
            urgency: detail.alert.info[0].urgency[0],
            severity: detail.alert.info[0].severity[0],
            sender: detail.alert.info[0].senderName[0],
            code: code,
            createdAt: timeStampHelper.get()
        };

    }


}

export default anyToModelParser;