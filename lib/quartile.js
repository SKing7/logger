var config = require('../config/config');
var cs = require('../config/task-log');
var _ = require('lodash');
var csv = require('fast-csv');
var moment = require('moment');
var mail = require('../lib/email');
var quartileController = require('../controller/quartile');

var logConfig = config.log;
var pers = config.pers;
var reportPath = logConfig.reportsPath;
var mailData = [];
var alias = config.alias.timingKeyMap;

module.exports = {
    toDb: function (data, time) {
        var reportDate = moment(time, logConfig.timestampRegx);
        var obj;

        quartileController.deleteByDate(time, function (e, drt) {
            cs.info('db delete result:' + drt);
            _.forEach(data, function (v, k) {
                obj = {reportDate: reportDate};
                _.forEach(v, function (v1, k1) {
                    obj.type = k; 
                    obj.name = k1; 
                    _.forEach(v1, function (v2, k2) {
                        obj.timingType = k2; 
                        obj.value = v2.data;
                        obj.sampleCount = v2.count;
                        quartileController.create(obj);
                    });
                });
            });
            cs.info('db done');
        });
    },
    toCsv:  function (data, csvStream) {
        var obj;
        _.forEach(data, function (v, k) {
            obj = {};
            _.forEach(v, function (v1, k1) {
                obj['key'] = k1;
                _.forEach(v1, function (v2, k2) {
                    // v2 => {data:..., count: ...}
                    _.forEach(pers, function (v3) {
                        v3 = parseInt(v3 * 100, 10);
                        obj[v3 + '%'] = v2.data[v3];
                    });
                    obj['指标描述'] = alias[k2] || k2;
                    obj['样本数'] = v2.count;
                    csvStream.write(obj);
                });
            });
        });
    }
}
