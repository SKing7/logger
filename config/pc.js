var path = require('path');
var rtMap = ['rt_mapshow', 'rt_mapLoad', 'rt_mapfileLoad'];
var olMap = [];
var imMap = [];
var axMap = [];
var ssrTiming = [];
var olTiming = []; //
var netTiming = [];
var axTiming = [];
var imTiming = [];
var exTiming = [];
var util = require('../lib/util');
var secret = util.getSecretConf();
var env = util.getNodeEnv();

module.exports = {
    //TODO aid
    aid: 2,
    db: {
        url: 'mongodb://127.0.0.1:27017/pctiming',
    },
    showInChart: ['fs'],
    mail: {
		title: '[速度报表]高德PC站速度指标报表_',
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        templateDir: 'timing-per-pc', 
        to:  secret.to[env],
        cc:  secret.cc[env],
    },
	limit: {
        keyMap: {
        },
        timingKeyMap: {
        },
	},
	order: {
	    timingTypesOrder: ['fs'].concat(ssrTiming.slice(1), exTiming, imTiming, olTiming, axTiming, netTiming),
	    keysOrder:  olMap.concat(rtMap, axMap) 
	},
    higherBetter: [],
    timingValueIsPercent: exTiming,
    alias: {
		timingKeyMap: {
        	fs: 'Timing Marks',
		},
        /*
        TODO  #too ugly
        */
		keyMap: {
			'rt_mapshow'        : '地图展示',
			'rt_mapLoad'        : '地图加载',
			'rt_mapfileLoad'        : '地图文件下载',
		},
    },
    screenShotImgs: ['pc_map_load', 'pc_map_show', 'pc_mapfile_load']
}
