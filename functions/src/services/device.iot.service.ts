import mongoFactory from "../mongo/mongo.factory";
import requestContextDto from "../dto/request-context.dto";
import { historyTypeEnum } from "../enum/history.enum";
import validatorHelper from "../helpers/validator.helper";
import { actionEnum } from "../enum/action.enum";
import deviceIotDto from "../dto/device.iot.dto";
import serviceFactory from "./service.factory";
import httpHelper from "../helpers/http.helper";
import httpStatusHelper from "../helpers/http-status.helper";
import deviceDto from "../dto/device.dto";
import deviceService from "./device.service";
import { deviceStatusString } from "../enum/device.enum";
import errorDto from "../dto/error.dto";
import setupDto from "../dto/setup.dto";
import firebaseFactory from "../firebase/firebase.factory";

class deviceIotService
    extends deviceService {

    private _deviceIotMongo = mongoFactory.deviceIot();
    private _locationFirebase = firebaseFactory.location();

    constructor(_context: requestContextDto) {
        super(_context, historyTypeEnum.deviceIot);
    }

    create = async (deviceIotDto: deviceIotDto) => {

        let deviceId = '';

        try {

            this._validateCreate(deviceIotDto);

            await this._validateAdmin(deviceIotDto);

            deviceIotDto.status = deviceStatusString.waiting;

            let dto = await this._deviceIotMongo.create(deviceIotDto);

            deviceIotDto.deviceId = dto.deviceId;
            deviceId = dto.deviceId;

            const resultActivation = await this._activation(deviceIotDto);

            dto.status = resultActivation.status;

            await this._statusUpdate(dto);

            await this._firebaseSetup(dto);

            await this._addIotsInUser(dto);

            await this.history(actionEnum.create, dto._id, dto);

            return dto;
        }
        catch (error) {

            if (deviceId) {
                this.delete(deviceId);
            }

            throw error;
        }

    }

    delete = async (deviceId: string) => {
        await this._deviceMongo.delete(deviceId);
        await this._locationFirebase.delete(deviceId);
    }   


    private _validateCreate(deviceIotDto: deviceIotDto) {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(deviceIotDto.alias, 'error:device.iot.form.empty-alias');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(deviceIotDto.externalId, 'error:device.iot.form.empty-externalId');
        validatorHelper.throwBadRequestIfIsNullOrEmpty(deviceIotDto.token, 'error:device.iot.form.empty-token');
    }

    private _validateAdmin = async (deviceIotDto: deviceIotDto) => {

        const constantService = serviceFactory.constant();
        const deviceIotActivation = await constantService.getDeviceIotActivation();

        try {
            await httpHelper.post(deviceIotActivation["url-validation"], deviceIotDto);
        }
        catch (error) {
            throw httpStatusHelper.badRequest('error:device.iot.admin.invalid-data', 'Ocorreu erro na validação')
        }

    }

    private _activation = async (deviceIotDto: deviceIotDto) => {

        const constantService = serviceFactory.constant();
        const deviceIotActivation = await constantService.getDeviceIotActivation();

        try {
            let result = await httpHelper.post(deviceIotActivation["url-activation"], deviceIotDto);
            return result;
        }
        catch (error) {
            let _err = new errorDto(400, 'error:device.iot.admin.activation-error', 'Ocorreu erro na ativação', true, error);
            throw _err;
        }
    }

    private _statusUpdate = async (deviceDto: deviceDto) => {
        return this._deviceIotMongo.statusUpdate(deviceDto);
    }

    private _firebaseSetup = async (deviceDto: deviceDto) => {

        if (deviceDto.status == deviceStatusString.active) {

            let setup = <setupDto>{
                uid: deviceDto.userUid,
                deviceId: deviceDto.deviceId
            }

            await this._locationFirebase.setup(setup)
        }
    }

    private _addIotsInUser = async (deviceDto: deviceDto) => {
        if (deviceDto.status == deviceStatusString.active) {
            let _serviceMonitoringAllowance = serviceFactory.monitoringAllowance(this._context);
            await _serviceMonitoringAllowance.addIot(deviceDto);
        }
    }


}

export default deviceIotService