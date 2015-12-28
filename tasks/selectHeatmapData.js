
var moment = require('moment');
var _ = require('lodash');
var argv = require('optimist').argv;
var outCsv = require('../lib/out_csv');
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
var controller = require('../controller/heatmap');

var logConfig = config.log;
var time = argv.t;
var currentPid = '/navigation/index/';

mongoose.connect(config.db.url);
console.log('db:', config.db.url);
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
async.parallel({
    findLast7Days: function (cb) {
        controller.findLastDays(time, 7, {
            pid: currentPid,
        }, 'happenAt value', cb);
    },
}, function(err, result) {
	if (err) {
    	cs.error(err);
		return;
	}
    outCsv.init('ht' + currentPid)
    var data = result.findLast7Days;
    var gData = groupDate(data);
    outToCsv(gData);

});
function groupDate(data) {
    var tmpData = {};
    for (var i = 0; i < 24; i++) {
        if (i < 10) {
            tmpData[i] = {};
        } else {
            tmpData[i] = {};
        }
    }
    console.log(tmpData);
    data = _.groupBy(data, function (v) {
        return v.happenAt.split(':')[0];
    });
    _.forEach(data, function (v, k) {
        tmpData[parseInt(k)] = v;
    })
    _.forEach(tmpData, function (v, dateStr) {
        tmpData[dateStr] = _.groupBy(v, function (v) {
            var sec=  parseInt(v.value / 200);
            if (sec > 15) {
                return 'toDel';
            }
            return sec;
        });
        delete tmpData[dateStr].toDel;
    });
    return tmpData;
}
function outToCsv(data) {
    var csvData = {};
    _.forEach(data, function (v, hour) {
        _.forEach(v, function (v, section) {
            csvData.Time = hour;
            csvData.Section = section;
            csvData.Temperature = v.length;
            outCsv.push(csvData);
        });
    });
    outCsv.end();
}
