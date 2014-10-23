'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/config');
var moment = require('moment');
var logConfig = config.log;
var Quartile = require('../models/quartile'),
    _ = require('lodash');

exports.create = function (data) {
    var quartile = new Quartile(data);
    quartile.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
};
exports.deleteByDate = function (d, cb) {
    var filter = {reportDate: oneDay(d)}; 
    Quartile.remove(filter).exec(cb);
};
exports.findAtThatDay = function (d, cb) {
    var filter = {reportDate: oneDay(d)}; 
    Quartile.find(filter).exec(cb);
};
exports.findAtPreMonth = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(1, 'month').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    Quartile.find(filter).exec(cb);
};
exports.findAtPreWeek = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(7, 'day').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    Quartile.find(filter).exec(cb);
};
exports.findAtPreDay = function (d, cb) {
    var tmp = moment(d, logConfig.timestampRegx).subtract(1, 'day').format(logConfig.timestampRegx);
    var filter = {reportDate: oneDay(tmp)}; 
    Quartile.find(filter).exec(cb);
};
function oneDay(d) {
    var start = moment(d, logConfig.timestampRegx).subtract(1, 'second');
    var end = moment(d, logConfig.timestampRegx).subtract(1, 'second').add(1, 'day');
    return {$gte: start, $lte: end}; 
}
