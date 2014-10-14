var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var cs = require('../lib/console');
var fs = require('fs');
var csv = require('fast-csv');
var reader = require('../lib/reader');
var env = process.env.NODE_ENV;
var eacher = reader.eacher();
var timingDb = {};
var limit = 10000;
var count = 0;
var showKeys = {
    rt: [],
    ol: ['la'],
    ax: ['open', 'received', 'loading', 'done'],
}
var startTime = mt.now();
var endTime;

var csvStream = csv.format({headers: true}),
    writableStream = fs.createWriteStream("my.csv");

writableStream.on("finish", function(){
   console.log("DONE!");
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
    var startIndex; 
    var endIndex; 
    var result = {};
    var tmpData;
    _.forEach(data, function (v, k) {
        len = v.length;
        startIndex = len * (per - 0.1); 
        endIndex = len * per; 
        data[k] = v.sort(function (v1, v2) {
            return v1 - v2;
        });
        tmpData = data[k].slice(startIndex, endIndex);
        result[k] = {};
        result[k].count = len;
        result[k].data = tmpData;
        result[k].samplecount = tmpData.length;
    })
    _.forEach(result, function (v, k) {
        var totalTime = 0;
        _.forEach(v.data, function (v) {
            totalTime += (+v);
        });
        csvStream.write({timingLabel: k, average: (totalTime / v.samplecount).toFixed(0), percent: per * 100  + '%'});
    });
}
function calcAx() {
}
function limiter(task) {
}
