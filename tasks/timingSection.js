var moment = require('moment');
var _ = require('lodash');
var argv = require('optimist').argv;
var auditLog = require('audit-log');
var mongoose = require('mongoose');

var reader = require('../lib/reader');
var util = require('../lib/util');
var out = require('../lib/out');
var config = require('../config/config');
var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var endTime;
var limit = 0;
var count = 0;
var currentPid = '/navigation/index/';

auditLog.addTransport("mongoose", {connectionString: config.db.url});
mongoose.connect(config.db.url);
console.log('db:', config.db.url);
if (env === 'production') {
    limit = 0;
}
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
eacher = reader.eacher(time);
eacher(function (data) {
    if (!data.pid) return;

    var fData;
    var pid = data.pid.replace(/%2F/g, '/');
    var fData;
    var db;

    if (limit && count > limit) return false;
    if (Math.floor(Math.random() * 100) > 10) return;
    fData = pickData(data, pid)

    if (!fData || Object.keys(fData).length === 0) return;

    db = util.getDbByLineData(data);
    db[pid] = db[pid] || [];
    db[pid].push(fData);
    count++;
}).then(function () {

    //outCsv.init('ht' + currentPid)
    console.log('日志数量：', count);
    var allDbs = util.getAllDbs();
    _.forEach(allDbs, function (db) {
        var datas = db.instance;
        var vDb = [];
        out.toDbOfModel('heatmap', datas, time);
    });
    setTimeout(function () {
        process.exit();
    }, 1000)
});
function pickData(data, pid) {
    if (pid === '/navigation/index/' && (data.tp === 'ol' || data.tp === 'rt')) {
        var rt;
        var transformRt = {};
        var fsKeyName;

        fsKeyName = 'rt' + pid.replace(/\//g, '_').slice(0, -1);
        //筛选： 是否有首屏数据
        rt = _.some(data, function (v, k) {
            return k === fsKeyName;
        });
        if (rt) {
            data = _.pick(data, function (v, k) {
                return (k=== '_time' || k === fsKeyName);
            });
            data.data = data[fsKeyName];
            delete data[fsKeyName];
            return data;
        }
    }
}
