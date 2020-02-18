import cultureEnum, { cultureString } from '../enum/culture.enum';

class localeToTest {
 
    static getToTest(code: string, culture: cultureString) {

        let files:any = {
            error: {
                pt: require('../locales/pt/error.json'),
                en: require('../locales/en/error.json')
            },
            text: {
                pt: require('../locales/pt/text.json'),
                en: require('../locales/en/text.json')
            }
        }
        let result: any = undefined;

        culture = culture || cultureEnum.culture();

        try {

            let codeSplit = code.split(':');
            let type = codeSplit[0];
            let terms = codeSplit[1].split('.');

            result = files[type][culture];

            for (let t of terms) {
                result = result[t];
            }

        } catch (error) {
            throw 'code não encontrado: ' + code
        }

        return result;

    }


}

export default localeToTest;