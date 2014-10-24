var path = require('path');
var rtMap = ['rt_index_index', 'rt_search_view', 'rt_search_mapview', 'rt_detail_index', 'rt_navigation_index', 'rt_navigation_buslist'];
var olMap = ['/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'];
var axMap = ['/service/poi/keywords.json', '/service/valueadded/infosearch.json'];

module.exports = {
    db: {
        url: 'mongodb://127.0.0.1:27017/motiming',
    },
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: path.resolve(process.env.NODE_ENV === 'production' ? __dirname + '/../reports' : __dirname + '/..') + '/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    mail: {
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to: process.env.NODE_ENV === 'production1' ? 'zero@autonavi.com' : 'zhe.liu@autonavi.com',
        cc: process.env.NODE_ENV === 'production' ? 'zhe.liu@autonavi.com': '',
        transport: {
            host: 'smtp.autonavi.com',
            port: 25,
            tls: {
                rejectUnauthorized:false
            },
            auth: {
                user: 'zhe.liu@autonavi.com',
                pass: '1994219lZ_123' //lZ_123
            }
        }
    },
	limit: {
        keyMap: {
            ol: olMap,
        },
        timingKeyMap: {
            ol: ['la'],
            ax: ['total', 'received', 'done'],
        },
	},
	order: {
	    timingTypesOrder: ['fs', 'la', 'total', 'received', 'done'],
	    keysOrder:  olMap.concat(rtMap, axMap) 
	},
    alias: {
		timingKeyMap: {
        	la: 'Page Load Time',
        	received: 'API Wait Time',
        	done: 'API Receive & Parse Time',
        	total: 'API Total Time',
        	fs: 'Page First Screen Time',
		},
		keyMap: {
			'/index/index/' : '首页',
		},
    },
    pers: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85, 0.95],
    primaryPer: 0.75,
}
