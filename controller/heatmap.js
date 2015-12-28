
'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/config');
var cs = require('../lib/console');
var moment = require('moment');
var logConfig = config.log;
var HeatMap = require('../models/heatmap'),
    _ = require('lodash');

exports.create = function (data) {
    var ins = new HeatMap(data);
    ins.save(function (err) {
        if (err) {
            cs.error(err);
        }
    });
};
exports.find = function (filter, fields, cb) {
    filter = mixedFilter(filter);
    HeatMap.find(filter, fields).sort('reportDate').exec(cb);
};
exports.delete = function (filter, cb) {
    filter = mixedFilter(filter);
    HeatMap.remove(filter).exec(cb);
};
exports.deleteByDate = function (d, cb) {
    var filter = mixedFilter({reportDate: oneDay(d) });
    this.delete(filter, cb);
};
exports.findLastDays = function (d, num, filter, fields, cb) {
    filter = _.assign(filter, {reportDate: recentDays(d, num)}); 
    this.find(filter, fields, cb);
};
exports.findThisMonth = function (d, filter, fields, cb) {
    filter = _.assign(filter, {reportDate: thisMonth(d)}); 
    this.find(filter, fields, cb);
};
function oneDay(d) {
    var start = moment(d, logConfig.timestampRegx).subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').add(1, 'day');
    return {$gte: start, $lte: end}; 
}
function mixedFilter(ext) {
    return ext;
}
function thisMonth(d) {
    var m = moment(d, logConfig.timestampRegx).month();
    var start = moment(d, logConfig.timestampRegx).date(1);
    var end = moment(d, logConfig.timestampRegx).date(1).month(m + 1);
    return {$gte: start, $lte: end}; 
}
function recentDays(d, days) {
    var start = moment(d, logConfig.timestampRegx).subtract(days - 1, 'day').subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').add(1, 'day');
    return {$gte: start, $lte: end}; 
}
