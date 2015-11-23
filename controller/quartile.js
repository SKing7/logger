'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/config');
var cs = require('../lib/console');
var moment = require('moment');
var logConfig = config.log;
var aid = config.aid;
var Quartile = require('../models/quartile'),
    _ = require('lodash');

exports.create = function (data) {
    var quartile = new Quartile(data);
    quartile.save(function (err) {
        if (err) {
            cs.error(err);
        }
    });
};
exports.find = function (filter, cb) {
    filter = mixedFilter(filter);
    Quartile.find(filter).sort('reportDate').exec(cb);
};
exports.delete = function (filter, cb) {
    filter = mixedFilter(filter);
    Quartile.remove(filter).exec(cb);
};
exports.deleteByDate = function (d, cb) {
    var filter = {}; 
    var filter = mixedFilter({reportDate: oneDay(d) });
    this.delete(filter, cb);
};
exports.findAtThatDay = function (d, cb) {
    var filter = {reportDate: oneDay(d)}; 
    this.find(filter, cb);
};
exports.findAtPreMonth = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(1, 'month').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    this.find(filter, cb);
};
exports.findAtPreWeek = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(7, 'day').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    this.find(filter, cb);
};
exports.findAtPreDay = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(1, 'day').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    this.find(filter, cb);
};
exports.find7Days = function (d, cb) {
    var filter = {reportDate: recent7Days(d)}; 
    this.find(filter, cb);
};
exports.findPre7Days = function (d, cb) {
    var start = moment(d, logConfig.timestampRegx).subtract(13, 'day').subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').subtract(6, 'day');
    var filter = {
		reportDate: {$gte: start, $lte: end}
	};
    this.find(filter, cb);
};
function oneDay(d) {
    var start = moment(d, logConfig.timestampRegx).subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').add(1, 'day');
    return {$gte: start, $lte: end}; 
}
function recent7Days(d) {
    var start = moment(d, logConfig.timestampRegx).subtract(6, 'day').subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').add(1, 'day');
    return {$gte: start, $lte: end}; 
}
function mixedFilter(ext) {
    return _.assign({aid: aid}, ext);
}
