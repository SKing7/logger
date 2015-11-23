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
var util = require('../lib/util');
var structData = require('../lib/structData');
var out = require('../lib/out');
var quartileController = require('../controller/quartile');
var sortAndAliasTimingType = util.sortAndAliasTimingType;
var structDataForReport = structData.pickDataforReport;

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
    cs.info('data read done');
    var recent7DaysRt = getRecent7DaysDataArgs(result);

    var rt = structDataForReport(result);
    rt = calc.relativeRadio(rt);
    rt = sortAndAliasTimingType(rt);
    cs.info('all data read ready');
    mail.sendPerTiming.apply(mail, recent7DaysRt.concat([rt, time, collectedIndex(result)]));
    cs.info('mail sended');
    setTimeout(function () {
        process.exit();
    }, 30000)
});
function getRecent7DaysDataArgs (result) {
	var ratio = calc.timingRadio(result.preRecent7Days, result.recent7Days);
    ratio = sortAndAliasTimingType(ratio);

    var r7Data = sortAndAliasTimingType(result.recent7Days);

	result.preRecent7Days = null;
	result.recent7Days = null;

    return [r7Data, ratio];
} 
function collectedIndex(result) {
    var indexCollections = {
        locationRate: structData.locationData(result.thatDay)
    };
    return indexCollections;
}
