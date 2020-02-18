import config from '../config/config';

import * as apiconfig from '../config/api.config.json';
import * as fenceconfig from '../config/fence.config.json';
import * as googleCert from '../config/google-cert.json';
import * as weatherAlertConfig from '../config/weather-alert.config.json';
import * as locationConfig from '../config/location.config.json';
import * as storageConfig from '../config/storage.config.json';
import * as monitoringConfig from '../config/monitoring.config.json';

let env = config.env();

global.config =
    {
        version: "1.5.0",
        api: (<any>apiconfig)[env],
        fence: (<any>fenceconfig)[env],
        google: {
            storage: (<any>googleCert)[env]
        },
        weatherAlert: weatherAlertConfig,
        location: (<any>locationConfig)[env],
        storage: (<any>storageConfig)[env],
        monitoring: monitoringConfig,
        env: env,
        envAbrev: config.envAbrev()
    };


console.log('------------------------------------------------------------------------------')
console.log(env);
console.log('------------------------------------------------------------------------------')



