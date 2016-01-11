var path = require('path');
var _ = require('lodash');
var util = require('../lib/util');
var defaultConfig = util.getSecretConf('defaultLogger');
var site = util.getSiteLabel();

var defaultConfig = {
    aidAlias: site,
	runningLog: {
		tasks:  {
			path: 'logs/task',
		},
		mongo:  {
			path: 'logs/mongo',
		}
	},
    showInChart: [],
    db: {
        url: 'mongodb://127.0.0.1:27017/motiming',
    },
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: __dirname + '/../reports/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    mail: {
        shotsUrlBase: defaultConfig.shotsPath, 
        transport: {
            host: defaultConfig.SMTPHost,
            secure: true,
            port: 465,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: defaultConfig.u,
                pass: defaultConfig.p 
            }
        }
    },
	limit: {
        keyMap: {
        },
        timingKeyMap: {
        },
	},
	order: {
	    timingTypesOrder: [],
	    keysOrder: []
	},
    higherBetter: [],
    timingValueIsPercent: [],
    alias: {
		timingKeyMap: {},
		keyMap: {},
    },
    pers: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85, 0.95, 1],
    primaryPer: 0.75,
    screenShotImgs: []
}
var siteConfig = require('./' + site + '.js')
var configFinal = util.mergeDeep(defaultConfig, siteConfig)
configFinal = Object.freeze(configFinal)
//设置默认数字类型的aid
global._aid = +configFinal.aid;

module.exports = configFinal;
