var _ = require('lodash');
var config = require('../config/config');
var pers = config.pers;
var showKeys = config.timingKeyMap;

module.exports = {
    rt: function (db, poll) {
        var data = db.rt;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            sortedData = v.sort(function (v1, v2) {
                return v1 - v2;
            });
            result[k] = {};
            byPer(sortedData, result[k]);
        })
        _.forEach(result, function (v, k) {
            obj = {性能指标: k};
            _.forEach(pers, function (v1) {
                obj[v1 * 100 + '%'] = v[v1];
            });
            poll.write(obj);
        });
    },
    ol: function (db, poll) {
        var data = db.ol;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            result[k] = {};
            _.forEach(v, function (v1, k1) {
                result[k][k1] = {};
                sortedData = v1.sort(function (v1, v2) {
                    return v1 - v2;
                });
                byPer(sortedData, result[k][k1]);
            });
        });
        out(result, poll);
    },
    ax: function (db, poll) {
        var data = db.ax;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            result[k] = {};
            _.forEach(v, function (v1, k1) {
                if (k1 !== 'total') return;
                result[k][k1] = {};
                sortedData = v1.sort(function (v1, v2) {
                    return v1 - v2;
                });
                byPer(sortedData, result[k][k1]);
            });
        });
        out(result, poll);
    }
}
function byPer(sortedData, obj) {
    var tmpData;
    var index; 
    var len = sortedData.length;
    _.forEach(pers, function (per) {
        index = Math.floor(len * per); 
        if (per === 1) {
            index = index - 1;
        }
        obj[per] = sortedData[index];
    });
}
function out(result, poll, keys) {
    var obj = {};
    _.forEach(result, function (v, k) {
        _.forEach(v, function (v1, k1) {
            obj = {性能指标: k};
            _.forEach(pers, function (v2) {
                obj[v2 * 100 + '%'] = v1[v2];
            });
            poll.write(obj);
        });
    });
}
function formatCsv() {
}
