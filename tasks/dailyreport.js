var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var argv = require('optimist').argv;
var mongoose = require('mongoose');
var async = require('async');

var reader = require('../lib/reader');
var calc = require('../lib/calc');
var transfer = require('../lib/transfer');
var cs = require('../lib/console');
var config = require('../config/config');
var mail = require('../lib/email');
var out = require('../lib/out');
var quartileController = require('../controller/quartile');

var env = process.env.NODE_ENV || 'dev';
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
    }
}, function(err, result) {
    cs.info('data read done');
    var rt = dataProto(result);
    rt = calcRadio(rt);
    cs.info('mail sending');
    mail.sendPerTiming(rt, time);
    cs.info('done');
});
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
function calcRadio(data) {
    var thatData;
    var dif;
    var difRadio;
    _.forEach(data, function (v, k) {
        _.forEach(v, function (v1, k1) {
            thatData = v1.thatDay;
            // k2:thatDay,preDay
            _.forEach(v1, function (v2, k2) {
                //没有当天数据
                if (!thatData) {
                    v1[k2] = '';
                    return;
                }
                if (k2 !== 'thatDay') {
                    //百分比 精确到小数点一位
                    dif = thatData -v2;
                    difRadio = parseInt(dif * 1000/ v2) / 10;
                    v1[k2] = difRadio + '%'
                    if (difRadio < 0) {
                        v1[k2] = '<em class="drop">' + v1[k2] + '</em>';
                    }
                    //+ ('(' + v2 + ')'); 
                }
            });
        });
    });
    return data;
}
