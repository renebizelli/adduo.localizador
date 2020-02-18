import cultureEnum, { cultureString } from '../enum/culture.enum.js';
import '../prototypes/string.prototype';
class locale {

    static async load() {

        global.locales = {
            'error': {
                'pt': await import('./pt/error.json'),
                'en': await import('./en/error.json'),
            },
            'text': {
                'pt': await import('./pt/text.json'),
                'en': await import('./en/text.json'),
            },
            'weather': {
                'pt': await import('./pt/weather.json'),
                'en': await import('./en/weather.json'),
            }
        }
    }

    static getWithComplement(code: string, culture: cultureString, complements: any[]) {
        let text = locale.get(code, culture);

        if (text) {
            text = text.stringFormat(complements);
        }

        return text;
    }

    static getTextWithComplement(code: string, culture: cultureString, complements: any[]) {
        let text = locale.getText(code, culture);

        if (text) {
            text = text.stringFormat(complements);
        }

        return text;
    }

    static getErrorWithComplement(code: string, culture: cultureString, complements: any[]) {
        let text = locale.getError(code, culture);

        if (text) {
            text = text.stringFormat(complements);
        }

        return text;
    }

    static getText(code: string, culture: cultureString) {
        return this.get('text:' + code, culture);
    }

    static getError(code: string, culture: cultureString) {
        return this.get('error:' + code, culture);
    }

    static get(code: string, culture: cultureString) {

        let source: any = undefined;
        let result = '';

        culture = culture || cultureEnum.culture();

        try {

            let codeSplit = code.split(':');
            let type = codeSplit[0];
            let terms = codeSplit[1].split('.');

            source = global.locales[type][culture];

            for (let t of terms) {
                source = source[t];
            }

            if (source) {
                result = source.toString();
            }

        } catch (error) {
            throw 'code não encontrado: ' + code
        }

        return result;

    }
}

export default locale;