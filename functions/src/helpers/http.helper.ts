import * as request from 'request';

class httpHelper {

    static post(uri: string, data: any, headers?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const options = {
                method: 'POST',
                url: uri,
                json: data,
                headers: headers
            }

            request.post(uri, options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(this.prepareBody(body));
                }
                else if (body) {
                    reject(this.prepareBody(body));
                }
                else {
                    reject({ statusCode: response.statusCode })
                }
            });

        })
    }

    static prepareBody(res: any) {

        if (res && typeof res == 'string') {
            return JSON.parse(res);
        }
        else if (res) {
            return res;
        }

    }

    static put(uri: string, data: any, headers?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const options = {
                method: 'PUT',
                url: uri,
                form: data,
                headers: headers
            }

            request.put(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(this.prepareBody(body));
                }
                else if (body) {
                    reject(this.prepareBody(body));
                }
                else {
                    reject({ statusCode: response.statusCode })
                }
            });

        })
    }

    static getXml(uri: string, headers?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const options = {
                method: 'GET',
                url: uri,
                headers: headers
            }

            request.get(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                }
                else {
                    reject(body)
                }
            });

        })
    }

    static get(uri: string, headers?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const options = {
                method: 'GET',
                url: uri,
                headers: headers
            }

            request.get(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(this.prepareBody(body));
                }
                else if (body) {
                    reject(this.prepareBody(body));
                }
                else {
                    reject({ statusCode: response.statusCode })
                }
            });

        })
    }

    static delete(uri: string, headers?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const options = {
                method: 'DELETE',
                url: uri,
                headers: headers
            }

            request.delete(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(this.prepareBody(body));
                }
                else if (body) {
                    reject(this.prepareBody(body));
                }
                else {
                    reject({ statusCode: response.statusCode })
                }
            });

        })
    }
}

export default httpHelper;