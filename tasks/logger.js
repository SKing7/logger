var moment = require('moment');
var _ = require('lodash');
var reader = require('../lib/reader');
var env = process.env.NODE_ENV;
var eacher = reader.eacher();
var timingDb = {};
var limit = 10;
var count = 0;
var showKeys = {
    rt: [],
    ol: ['la'],
    ax: ['open', 'received', 'loading', 'done'],
}
eacher(function (data) {
    if (count > limit) return false;
    calc(data);
    count++;
}).then(function () {
    console.log(timingDb);
});
function calc(data) {
    var type = data.tp;
    switch (type) {
    case 'ax':
        transfer(data, 'url');
        break;
    case 'rt':
        transfer(data, 'rt');
        break;
    case 'ol':
        transfer(data, 'pid');
        break
    }
}
function transfer(data, type) {
    var tp = data.tp;
    var sks = showKeys[tp] || [];
    var indexDb = timingDb[tp] = timingDb[tp] || {};
    var index = data[type] || data.pid;
    var idb = indexDb[index]  = indexDb[index] || []; 
    var i;

    _.forEach(data, function (v, k) {
        if (k.indexOf('rt_') === 0) {
            timing.rt[k] = timingDb.rt[k] || [];
            timingDb.push(v);
        } else {
            i = _.indexOf(sks, k)
            if (i < 0) return;
            idb[k] = idb[k] || []; 
            idb[k].push(v); 
        }
    });
} 
function calcOl(data) {
    toDbBy(data, 'pid');
}
function calcRt(data) {
}
function calcAx(data) {
    toDbBy(data, 'url');
}
function limiter(task) {
}
