var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var argv = require('optimist').argv;
var mongoose = require('mongoose');
var async = require('async');

var env = process.env.NODE_ENV || 'dev';
var reader = require('../lib/reader');
var calc = require('../lib/calc');
var transfer = require('../lib/transfer');
var config = require('../config/config');
var cs = require('../config/task-log');
var mail = require('../lib/email');
var out = require('../lib/out');
var quartileController = require('../controller/quartile');

var logConfig = config.log;
var time = argv.t;

mongoose.connect(config.db.url);
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
async.parallel({
    thatDay: function (cb) {
        quartileController.findAtThatDay(time, cb);
    },
    preDay: function (cb) {
        quartileController.findAtPreDay(time, cb);
    },
    preWeek: function (cb) {
        quartileController.findAtPreWeek(time, cb);
    },
    preMonth: function (cb) {
        quartileController.findAtPreMonth(time, cb);
    },
    recent7Days: function (cb) {
        quartileController.find7Days(time, function (err, data) {
			if (err) {
				cs.error(err);
				return;
			}
			cb(err, calc.aveOf7days(data));
		});
    },
    preRecent7Days: function (cb) {
        quartileController.findPre7Days(time, function (err, data) {
			if (err) {
				cs.error(err);
				return;
			}
			cb(err, calc.aveOf7days(data));
		});
    }
}, function(err, result) {
	if (err) {
    	cs.error(err);
		return;
	}
	var r7 = result.recent7Days;
	var radio = calc.timingRadio(result.preRecent7Days, r7);
	result.recent7Days = null;
	result.preRecent7Days = null;
    cs.info('data read done');
    var rt = dataProto(result);
    rt = calc.relativeRadio(rt);
    rt = sortAndAlias(rt);
    r7 = sortAndAlias(r7);
    radio = sortAndAlias(radio);
    cs.info('all data read ready');
    mail.sendPerTiming(rt, r7, radio, time);
    cs.info('mail sended');
});
function sortAndAlias(rt) {
	var orderConfig = config.order;
	var timingAlias = config.alias.timingKeyMap;
	var keyAlias = config.alias.keyMap;
	var aliased = {};
	//timing: {}
	var ordered = {};
	_.forEach(orderConfig.timingTypesOrder, function (v, k) {
		if (rt[v]) {
			ordered[v] = rt[v];
		}
	});
	rt = ordered;
	_.forEach(rt, function (v1, k1) {
		ordered = {};
		//k1: fs,waiting
		_.forEach(orderConfig.keysOrder, function (v2, k2) {
			if (v1[v2]) {
				ordered[keyAlias[v2] || v2] = v1[v2];
			}
		});
		aliased[timingAlias[k1] || k1] = ordered;
	})
	return aliased;
}
function dataProto(result) {
    var pdType;
    var pdName;
    var rt = {};
    var timingType;

    var baseData = result.thatDay;
    //date
    _.forEach(result, function (v, k) {
        //rt ol
        pdType = _.groupBy(v, 'type');
        _.forEach(pdType, function (v1, k1) {
            //name: /index/index....
            pdName = _.groupBy(v1, 'name');
            _.forEach(pdName, function (v2, k2) {
                // wating,loading,fs,.....
                _.forEach(v2, function (v3, k3) {
                    timingType = v3.timingType;
                    rt[timingType] = rt[timingType] || {};
                    rt[timingType][k2] = rt[timingType][k2] || {};
                    rt[timingType][k2][k] = v3.value[config.primaryPer * 100];
                });
            });
        });
    });
    return rt;
}
