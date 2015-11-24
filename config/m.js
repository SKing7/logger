var path = require('path');
var rtMap = ['rt_index_index', 'rt_search_view', 'rt_search_mapview', 'rt_detail_index', 'rt_navigation_index', 'rt_navigation_buslist', 'rt_nearby_index'];
var olMap = ['/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/', '/nearby/index/'];
var imMap = ['/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/', '/nearby/index/'];
var axMap = ['/service/poi/keywords.json', '/service/valueadded/infosearch.json'];
var ssrTiming = ['c_fsp','fsp', 'ssrct', 'fsp_mixed'];
var olTiming = ['la', 'dl']; //
var netTiming = [ 'readyStart', 'redirectTime', 'requestTime', 'initDomTreeTime', 'domReadyTime'];
var axTiming = ['total', 'received', 'done'];
var imTiming = [
't_loc_android', 'loc_android_ip_failure','loc_android_other_failure',
'loc_android_glh_success',  'loc_android_ugi_success','loc_android_ams_success',
't_loc_ios', 'loc_ios_ip_failure', 'loc_ios_other_failure', 
'loc_ios_glh_success', 'loc_ios_ugi_success',
//'loc_ios_ams_success',
];
var exTiming = ['cchr'];
var util = require('../lib/util');
var secret = util.getSecretConf();
var env = util.getNodeEnv();

module.exports = {
    aid : 1,
    showInChart: ['c_fsp', 'dl', 'fs', 'la', 'received', 'done', 'total'],
    mail: {
		title: '[速度报表]高德M站速度指标报表_',
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to:  secret.to[env],
        cc:  secret.cc[env],
    },
	limit: {
        keyMap: {
            ol: olMap,
            im: imMap,
        },
        timingKeyMap: {
            ol: olTiming.concat(ssrTiming, netTiming),
            ax: axTiming,
        },
	},
	order: {
	    timingTypesOrder: ['c_fsp', 'fs'].concat(ssrTiming.slice(1), exTiming, imTiming, olTiming, axTiming, netTiming),
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
            loc_ios_ip_failure: 'iOS IP Location Failure',
            loc_ios_other_failure: 'iOS Other Location Failure',
            loc_android_ip_failure: 'Android IP Location Failure',
            loc_android_other_failure: 'Android Other Location Failure',
            loc_android_glh_success: 'Android HTML5 GeoLocaltion Success Rate' , 
            loc_ios_glh_success: 'iOS HTML5 GeoLocaltion Success Rate', 
            loc_android_ugi_success: 'Android UC GI Location Success Rate',
            loc_ios_ugi_success: 'iOS UC GI Location Success Rate', 
            loc_android_ams_success: 'Android AMP Service Location Success Rate',
            //loc_ios_ams_success: 'iOS AMP Service Location Success Rate',
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
    screenShotImgs: [ 'index_index', 'detail_index', 'navigation_index', 'navigation_buslist', 'search_view', 'search_mapview']
}
