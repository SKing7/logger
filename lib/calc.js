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
            result[k].fs = {};
            byPer(sortedData, result[k].fs);
        })
        poll.write('rt', result);
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
        poll.write('ol', result);
    },
    ax: function (db, poll) {
        var data = db.ax;
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
        poll.write('ax', result);
    },

}
function byPer(sortedData, obj) {
    var tmpData;
    var index; 
    var len = sortedData.length;
    obj.data = {};
    obj.count = sortedData.length;
    _.forEach(pers, function (per) {
        index = Math.floor(len * per); 
        if (per === 1) {
            index = index - 1;
        }
        obj.data[parseInt(per * 100, 10)] = sortedData[index];
    });
}
