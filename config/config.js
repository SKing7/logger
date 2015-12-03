var path = require('path');
var _ = require('lodash');
var util = require('../lib/util');
var secret = util.getSecretConf();
var site = util.getSiteLabel();

var defaultConfig = {
    aids: [1],
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
        transport: {
            host: 'smtp.alibaba-inc.com',
            secure: true,
            port: 465,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: 'opendev_noreply@alibaba-inc.com',
                pass: secret.p 
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
//设置默认aid
global._aid = configFinal.aid;

module.exports = configFinal;
