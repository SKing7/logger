
var config = require('../config/config');
var cs = require('../config/task-log');
var _ = require('lodash');
var csv = require('fast-csv');
var moment = require('moment');
var mail = require('../lib/email');
var controller = require('../controller/heatmap');

var logConfig = config.log;
var pers = config.pers;
var reportPath = logConfig.reportsPath;
var mailData = [];
var alias = config.alias.timingKeyMap;

module.exports = {
    toDb: function (data, time) {
        var reportDate = moment(time, logConfig.timestampRegx);
        var obj;
        var i = 0;

        controller.deleteByDate(time, function (e, drt) {
            var tmp = {};
            cs.info('db delete result:' + drt);
            tmp.reportDate = reportDate;
            _.forEach(data, function (v, pid) {
                _.forEach(v, function (obj, k) {
                    tmp.happenAt = obj._time;
                    tmp.value = obj.data;
                    tmp.pid = pid;
                    tmp.aid = 1;
                    controller.create(tmp);
                    i++;
                });
            });
            console.log(i);
        });
        cs.info('db done');
    },
    toCsv:  function (data, csvStream) {
    }
}
