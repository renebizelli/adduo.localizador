import httpStatusHelper from "./http-status.helper";
import geoPointInterface from "../interfaces/geo-point.interface";
import { cultureString } from "../enum/culture.enum";
import locale from "../locales/locale";
import '../prototypes/string.prototype';

class validatorHelper {

    static isNumberAndNotZero = (n: any): boolean => {
        return validatorHelper.isNumber(n) && n != 0;
    }

    static isNumber = (n: any) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static isNullOrEmpty = (o: any) => {
        return (o == null || o == undefined || o === '') && typeof o !== "boolean";
    }

    static notNullOrEmpty = (o: any) => {
        return !validatorHelper.isNullOrEmpty(o)
    }

    static isEmptyArray = (array: any) => {
        return !Array.isArray(array) || !array.length;
    }

    static allNotNullOrEmpty = (array: any) => {

        let valid = Array.isArray(array)

        if (valid) {
            for (let i = 0;
                (i < array.length) && valid; i++) {
                valid = validatorHelper.notNullOrEmpty(array[i])

            }
        }

        return valid
    }

    static isValidName = (name?: string) => {
        //let regex = /^(?=.{5,100}$)[a-zA-ZáéíóúàèìòùãõäëïöüâêîôûçÁÉÍÓÚÀÈÌÒÙÃÕÄËÏÖÜÂÊÎÔÛÇ]{2,}[ \t\r\n\v\f]{1}[a-zA-ZáéíóúàèìòùãõäëïöüâêîôûçÁÉÍÓÚÀÈÌÒÙÃÕÄËÏÖÜÂÊÎÔÛÇ]{2,}[a-zA-ZáéíóúàèìòùãõäëïöüâêîôûçÁÉÍÓÚÀÈÌÒÙÃÕÄËÏÖÜÂÊÎÔÛÇ\s]*$/
        return true;
    }

    static isValidEmail = (email?: string) => {
        let regex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
        return regex.test(email || '');
    }

    static isValidPassword = (password: string) => {
        let regex = /^(?=.*[A-ZÁÉÍÓÚÀÈÌÒÙÃÕÄËÏÖÜÂÊÎÔÛÇ])(?=.*\d)(?=.*[$@$!%*#?&])[A-ZÁÉÍÓÚÀÈÌÒÙÃÕÄËÏÖÜÂÊÎÔÛÇa-záéíóúàèìòùãõäëïöüâêîôûç\d$@$!%*#?&]{8,}$/
        return regex.test(password || '');
    }

    static isValidGeoPoint = (o: geoPointInterface) => {

        return validatorHelper.notNullOrEmpty(o) &&
            validatorHelper.notNullOrEmpty(o.location.lat) &&
            validatorHelper.notNullOrEmpty(o.location.lng) &&
            validatorHelper.isNumber(o.location.lat) &&
            validatorHelper.isNumber(o.location.lng)
    }

    static includeIn = (value: any, array: any[]) => {

        return validatorHelper.notNullOrEmpty(value) &&
            array.includes(value);

    }

    static throwBadRequestIfIsNullOrEmpty = (field: any, code: string) => {

        if (validatorHelper.isNullOrEmpty(field)) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestIfZero = (field: number, code: string) => {

        if (validatorHelper.isNumber(field) && field === 0) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestIfZeroNullOrEmpty = (field: number, code: string) => {
        validatorHelper.throwBadRequestIfIsNullOrEmpty(field, code);
        validatorHelper.throwBadRequestIfZero(field, code);
    }


    static throwBadRequestIfIsNotNumber = (field: any, code: string) => {

        validatorHelper.throwBadRequestIfIsNullOrEmpty(field, code);

        if (isNaN(field)) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestIfDiff = (value1: any, value2: any, code: string) => {

        if (value1 !== value2) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwNotFoundIfNull = (field: any, code: string) => {

        if (validatorHelper.isNullOrEmpty(field)) {
            throw httpStatusHelper.notFound(code);
        }

    }

    static throwBadRequestIfTrue = (condition: boolean, code: string) => {

        if (condition) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestWithArgs = (condition: boolean, code: string, culture: cultureString, args: string[]) => {

        if (condition) {
            let message = locale.get(code, culture);
            if (message) {
                message = message.toString().stringFormat(args);
            }
            throw httpStatusHelper.badRequest(code, message);
        }
    }

    static throwBadRequestIfInvalidGeoPoint = (o: geoPointInterface, code: string) => {

        if (!validatorHelper.isValidGeoPoint(o)) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestIfIsEmptyArray = (a: any, code: string) => {

        if (validatorHelper.isEmptyArray(a)) {
            throw httpStatusHelper.badRequest(code);
        }

    }

    static throwBadRequestIfNotInclude = (value: string = '', array: any[], code: string) => {

        if (!validatorHelper.includeIn(value, array)) {
            throw httpStatusHelper.badRequest(code);
        }
    }

    static throwBadRequestIfInvalidName = (value: string = '', code: string) => {

        if (!validatorHelper.isValidName(value)) {
            throw httpStatusHelper.badRequest(code);
        }
    }

    static throwBadRequestIfInvalidEmail = (value: string = '', code: string) => {

        if (!validatorHelper.isValidEmail(value)) {
            throw httpStatusHelper.badRequest(code);
        }
    }

    static throwBadRequestIfInvalidPhone = (value: string = '', code: string) => {
        validatorHelper.throwBadRequestIfNotEnoughLength(value, 8, code);
    }

    static throwBadRequestIfNotEnoughLength = (value: string = '', minimumLenght: number, code: string) => {

        if (value.length < minimumLenght) {
            throw httpStatusHelper.badRequest(code);
        }
    }

    static throwBadRequestIfPasswordInvalid = (value: string = '', code: string) => {

        if (!validatorHelper.isValidPassword(value)) {
            throw httpStatusHelper.badRequest(code);
        }
    }

}

export default validatorHelper;