var path = require('path');
var rtMap = ['rt_index_index', 'rt_search_view', 'rt_search_mapview', 'rt_detail_index', 'rt_navigation_index', 'rt_navigation_buslist', 'rt_nearby_index'];
var olMap = ['/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/', '/nearby/index/'];
var axMap = ['/service/poi/keywords.json', '/service/valueadded/infosearch.json'];
var ssrTiming = ['c_fsp','fsp', 'ssrct', 'fsp_mixed'];
var olTiming = ['t_loc_android', 't_loc_ios', 'la', 'dl']; //
var netTiming = [ 'readyStart', 'redirectTime', 'requestTime', 'initDomTreeTime', 'domReadyTime'];
var axTiming = ['total', 'received', 'done'];
var exTiming = ['cchr', 'loc_android', 'loc_ios'];

module.exports = {
	runningLog: {
		tasks:  {
			path: 'logs/task',
		},
		mongo:  {
			path: 'logs/mongo',
		}
	},
    showInChart: ['c_fsp', 'dl', 'fs', 'la', 'received', 'done', 'total'],
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
		title: '[速度报表]高德M站速度指标报表_',
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to: process.env.NODE_ENV === 'production' ? 'amap-web-m@list.alibaba-inc.com' : 'liuzhe.pt@alibaba-inc.com',
        cc: process.env.NODE_ENV === 'production' ? 'tongyao.ty@alibaba-inc.com,shaohang.ysh@alibaba-inc.com,yuki@alibaba-inc.com,sunzhao.szh@alibaba-inc.com,wangxing.wangx@alibaba-inc.com,cuifang.gcf@alibaba-inc.com,liuzhe.pt@alibaba-inc.com': '',
        transport: {
            host: 'smtp.alibaba-inc.com',
            secure: true,
            port: 465,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: 'opendev_noreply@alibaba-inc.com',
            }
        }
    },
	limit: {
        keyMap: {
            ol: olMap,
        },
        timingKeyMap: {
            ol: olTiming.concat(ssrTiming, netTiming),
            ax: axTiming,
        },
	},
	order: {
	    timingTypesOrder: ['c_fsp', 'fs'].concat(ssrTiming.slice(1), exTiming, olTiming, axTiming, netTiming),
	    keysOrder:  olMap.concat(rtMap, axMap) 
	},
    higherBetter: ['cchr'],
    timingValueIsPercent: exTiming,
    alias: {
		timingKeyMap: {
        	la: 'Page Load Time',
        	fsp: 'SSR First Paint Screen Time',
        	ssrct: 'SSR Server Cost Time',
        	fsp_mixed: 'SSR Total Cost Time',
        	c_fsp: 'Timing Marks(with SSR)',
        	dl: 'Page DOMContent Load Time',
        	received: 'API Wait Time',
        	done: 'API Receive & Parse Time',
        	total: 'API Total Time',
        	fs: 'Timing Marks',
        	cchr: 'Static File Cache Hit Rate',
        	t_loc_ios: 'iOS Location Cost Time',
        	t_loc_android: 'Android Location Cost time',
            readyStart: 'Browser Fetch Start Time',
            redirectTime: 'Page Redirect Time',
            requestTime: 'Page Download Time',
            initDomTreeTime: 'DOM Tree Init Time',
            domReadyTime: 'DOM Tree Init-Ready Time',
		},
        /*
        TODO  #too ugly
        */
		keyMap: {
			'rt_index_index'        : '首页首屏',
			'rt_nearby_index'       : '附近页首屏',
			'rt_search_view'        : '搜索结果列表页首屏',
			'rt_search_mapview'     : '搜索结果图面页首屏',
			'rt_detail_index'       : 'POI详情页首屏',
			'rt_navigation_index'   : '路线首页首屏',
			'rt_navigation_buslist' : '公交导航结果页首屏',

			'/index/index/'         : '首页',
			'/nearby/index/'         : '附近页',
			'/search/view/'         : '搜索结果列表页',
			'/search/mapview/'      : '搜索结果图面页',
			'/detail/index/'        : 'POI详情页',
			'/navigation/index/'    : '路线首页',
			'/navigation/buslist/'  : '公交导航结果页',

			'/service/poi/keywords.json'    : '搜索数据',
			'/service/valueadded/infosearch.json'  : 'POI详情数据',
		},
    },
    pers: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85, 0.95, 1],
    primaryPer: 0.75,
}
