
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
    task_1: function (cb) {
        controller.findThisMonth(time, {
            pid: currentPid,
        }, 'reportDate value', cb);
    },
}, function(err, result) {
	if (err) {
    	cs.error(err);
		return;
	}
    var dateStr = moment(time, logConfig.timestampRegx).format('YYYYMM');
    outCsv.init('ht_' + dateStr + '_' + currentPid)
    var data = result.task_1;
    var totalCountMap = {};
    var gData = groupDate(data, totalCountMap);
    outToCsv(gData, totalCountMap);

});
function groupDate(data, totalCountMap) {
    var tmpData = {};
    tmpData = _.groupBy(data, function (v) {
        return moment(v.reportDate).format('DD');
    });
     _.forEach(tmpData, function (v, k) {
        totalCountMap[k] = v.length 
    });
    _.forEach(tmpData, function (v, dateStr) {
        tmpData[dateStr] = _.groupBy(v, function (v) {
            var sec=  parseInt(v.value / 100);
            if (sec > 30) {
                return 'toDel';
            }
            return sec;
        });
        if (tmpData[dateStr].toDel) {
            totalCountMap[dateStr] -= tmpData[dateStr].toDel.length;
        }
        delete tmpData[dateStr].toDel;
    });
    return tmpData;
}
function outToCsv(data, totalCountMap) {
    var csvData = {};
    _.forEach(data, function (v, day) {
        _.forEach(v, function (v, section) {
            csvData.Time = day;
            csvData.Section = section;
            csvData.Temperature = parseInt((v.length * 1000) / totalCountMap[day], 10) / 10;
            outCsv.push(csvData);
        });
    });
    outCsv.end();
}
