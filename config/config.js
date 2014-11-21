var path = require('path');
var rtMap = ['rt_index_index', 'rt_search_view', 'rt_search_mapview', 'rt_detail_index', 'rt_navigation_index', 'rt_navigation_buslist', 'rt_index_lbs'];
var olMap = ['/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'];
var axMap = ['/service/poi/keywords.json', '/service/valueadded/infosearch.json'];

module.exports = {
	runningLog: {
		tasks:  {
			path: 'logs/task',
		},
		mongo:  {
			path: 'logs/mongo',
		}
	},
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
		title: '[速度报表]高德Mo站速度指标报表_',
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to: process.env.NODE_ENV === 'production' ? 'bigdata-mo@autonavi.com' : 'zhe.liu@autonavi.com',
        //to: process.env.NODE_ENV === 'production' ? 'bigdata-mo@autonavi.com' : 'zero@autonavi.com',
        cc: process.env.NODE_ENV === 'production' ? 'Curtis@autonavi.com,zero@autonavi.com,Yuki@autonavi.com,michael@autoanvi.com,zhao.sun@autonavi.com,zhe.liu@autonavi.com,kangning.liu@autonavi.com': '',
        transport: {
            host: 'smtp.autonavi.com',
            port: 25,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: 'zhe.liu@autonavi.com',
            }
        }
    },
	limit: {
        keyMap: {
            ol: olMap,
        },
        timingKeyMap: {
            ol: ['la', 'dl'],
            ax: ['total', 'received', 'done'],
        },
	},
	order: {
	    timingTypesOrder: ['fs', 'la', 'dl', 'total', 'received', 'done'],
	    keysOrder:  olMap.concat(rtMap, axMap) 
	},
    alias: {
		timingKeyMap: {
        	la: 'Page Load Time',
        	dl: 'Page DOMContent Load Time',
        	received: 'API Wait Time',
        	done: 'API Receive & Parse Time',
        	total: 'API Total Time',
        	fs: 'Timing Marks',
		},
        //TODO #X too ugly
		keyMap: {
			'rt_index_index'        : '     首页首屏     ',
			'rt_search_view'        : '搜索结果列表页首屏',
			'rt_search_mapview'     : '搜索结果图面页首屏',
			'rt_detail_index'       : '   POI详情页首屏  ',
			'rt_navigation_index'   : '   路线首页首屏   ',
			'rt_navigation_buslist' : '公交导航结果页首屏',
			'rt_index_lbs'          : '    首页LBS外链   ',

			'/index/index/'         : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			'/search/view/'         : '  搜索结果列表页  ',
			'/search/mapview/'      : '  搜索结果图面页  ',
			'/detail/index/'        : '     POI详情页    ',
			'/navigation/index/'    : '     路线首页     ',
			'/navigation/buslist/'  : '  公交导航结果页  ',

			'/service/poi/keywords.json'    : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;搜索数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
			'/service/valueadded/infosearch.json'  : '    POI详情数     ',
		},
    },
    pers: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85, 0.95],
    primaryPer: 0.75,
}
