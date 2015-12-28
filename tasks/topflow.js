var moment = require('moment');
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

var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var timingDb = {};
var endTime;
var limit = 0;
var count = 0;

if (env === 'production') {
    limit = 0;
}
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
var eacher = reader.eacher(time);
var result = {};
eacher(function (data) {
    if (limit && count > limit) return false;
    var pid = data.pid 
    if (!pid) console.log(data);
    if (data.tp !== 'ol') return;
    pid = pid.replace(/%2F/g, '/');
    result[pid] = result[pid] || 0;
    result[pid]++
    count++;
}).then(function () {
    var ar = [];
    _.forEach(result, function (v, k) {
        ar.push({name: k, v: v});
    })
    console.log(_.sortBy(ar, 'v').reverse());
});
