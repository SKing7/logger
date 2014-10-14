var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var cs = require('../lib/console');
var config = require('../config/config');
var logConfig = config.log;
var fs = require('fs');
var csv = require('fast-csv');
var reader = require('../lib/reader');
var env = process.env.NODE_ENV;
var argv = require('optimist').argv;
var time = argv.t;
if (!time) {
    time = moment().subtract(1, 'days').format('YYYYMMDD');
}
var eacher = reader.eacher(time);
var timingDb = {};
var limit = 0;
var count = 0;
var showKeys = {
    rt: [],
    ol: ['la'],
    ax: ['open', 'received', 'loading', 'done'],
}
var startTime = mt.now();
var endTime;

var csvStream = csv.format({headers: true}),
    writableStream = fs.createWriteStream(logConfig.reportsPath + time + ".csv");

writableStream.on("finish", function(){
   cs.info("DONE!");
});
csvStream.pipe(writableStream);

eacher(function (data) {
    if (limit && count > limit) return false;
    transfer(data);
    count++;
}).then(function () {
    endTime = mt.now();
    cs.info('read use time: ' + (endTime - startTime));
    cs.info(count + ' line logs');
    calc();
    csvStream.end();
    cs.info('use time: ' + (mt.now() - startTime));
});
function transfer(data) {
    var type = data.tp;
    switch (type) {
    case 'ax':
        //transfer(data, 'url');
        break;
    case 'rt':
        transferRt(data, 'rt');
        break;
    case 'ol':
        //transfer(data, 'pid');
        break
    }
}
function transferOl(data, type) {
    var tp = data.tp;
    var sks = showKeys[tp] || [];
    var indexDb = timingDb[tp] = timingDb[tp] || {};
    var index = data[type] || data.pid;
    var idb = indexDb[index]  = indexDb[index] || []; 
    var i;

    _.forEach(data, function (v, k) {
        if (k.indexOf('rt_') === 0) {
            timingDb.rt[k] = timingDb.rt[k] || [];
            timingDb.rt[k].push(v);
        } else {
            i = _.indexOf(sks, k)
            if (i < 0) return;
            idb[k] = idb[k] || []; 
            idb[k].push(v); 
        }
    });
} 
function transferRt(data, type) {
    var tp = data.tp;
    var idb = timingDb[tp] = timingDb[tp] || {};
    _.forEach(data, function (v, k) {
        if (k.indexOf('rt_') !== 0) {
            return;
        }
        idb[k] = idb[k] || []; 
        idb[k].push(v); 
    });
}
function calc() {
    calcRt(0.9);
    calcRt(0.5);
}
function calcOl() {
}
function calcRt(per) {
    per = per || 0.5;
    var data = timingDb.rt;
    var len;
    var index; 
    var result = {};
    var tmpData;
    _.forEach(data, function (v, k) {
        len = v.length;
        index = Math.floor(len * per); 
        data[k] = v.sort(function (v1, v2) {
            return v1 - v2;
        });
        tmpData = data[k][index];
        result[k] = {};
        result[k].count = len;
        result[k].data = tmpData;
    })
    _.forEach(result, function (v, k) {
        csvStream.write({timingLabel: k, requesttime: v.data, percent: per * 100  + '%'});
    });
}
function calcAx() {
}
function limiter(task) {
}
