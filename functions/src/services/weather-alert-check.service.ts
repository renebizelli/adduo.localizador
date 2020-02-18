import mongoFactory from "../mongo/mongo.factory";
import requestContextDto from "../dto/request-context.dto";
import baseService from "./base.service";
import weatherAlertDto from "../dto/weather-alert.dto";
import serviceFactory from "./service.factory";
import locale from "../locales/locale";
import { cultureString } from "../enum/culture.enum";
import '../prototypes/string.prototype';
import notificationParser from "../parsers/notification.parse";
import timeStampHelper from "../helpers/timestamp.helper";
import userWeatherAlertDto from "../dto/user-weather-alert.dto";
import { fenceStatusString } from "../enum/fence.enum";
import firebaseFactory from "../firebase/firebase.factory";
import locationDto from '../dto/location.dto';

class weatherAlertCheckService
    extends baseService {

    private _userMongo = mongoFactory.user();
    private _weatherAlertMongo = mongoFactory.weatherAlert();
    private _locationFirebase = firebaseFactory.location();

    constructor(_context: requestContextDto) {
        super(_context);
    }

    check = async (deviceId: string) => {

        let locationDto = await this._locationFirebase.one(deviceId);
        locationDto.deviceId = deviceId;

        await this._process(locationDto);
    }

    private _process = async (locationDto: locationDto) => {

        let fence = await this._weatherAlertMongo.checkInside(locationDto.location);

        let current = await this._userMongo.weatherAlertOne(this._context.uid);

        let status = this._calculateStatus(fence, current);

        if (status == fenceStatusString.inside && fence) { // fence colocado apenas para o typescript compilar.

            await this._userMongo.weatherAlertInsideUpdate(this._context.uid, fence._id);

            await this._notification(status, fence.code);
        }
        else if (status == fenceStatusString.outside) { // fence colocado apenas para o typescript compilar.

            await this._userMongo.weatherAlertOutsideUpdate(this._context.uid);

            await this._notification(status);
        }
    }

    private _calculateStatus(fence?: weatherAlertDto, current?: userWeatherAlertDto) {

        let status = fenceStatusString.none;

        if (fence && (!current || fence._id != current.id)) {
            status = fenceStatusString.inside;
        }
        else if (!fence && current) {
            status = fenceStatusString.outside;
        }

        return status;
    }

    private _notification = async (status: fenceStatusString, codeWeatherAlert?: string) => {

        let bodyKey = (status == fenceStatusString.inside) ?
            "text:weather.alert.body.{0}.inside." + codeWeatherAlert :
            "text:weather.alert.body.{0}.outside";

        let ts = timeStampHelper.get();

        let monitoringAllowance = serviceFactory.monitoringAllowance(this._context);
        let allowed = await monitoringAllowance.allowedMany();

        for (let itemAllowed of allowed) {
            await this._send(itemAllowed.uid, bodyKey.stringFormat(['monitorable']), itemAllowed.culture, ts);
        }

        await this._send(this._context.uid, bodyKey.stringFormat(['one-self']), this._context.culture, ts);
    }

    private _send = async (uid: string, bodyKey: string, culture: string, ts: number) => {

        let title = locale.get("text:weather.alert.title", <cultureString>culture);

        let body = locale.get(bodyKey, <cultureString>culture);
        body = body.naming(this._context.name);

        let queues = notificationParser.weatherAlert([uid], title, body, this._context.uid, ts);

        let notificationManager = serviceFactory.notification(this._context);
        await notificationManager.send(queues);
    }
}

export default weatherAlertCheckService;