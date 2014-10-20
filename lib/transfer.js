var _ = require('lodash');

var config = require('../config/config');

var showKeys = config.timingKeyMap;
var showPages = config.limitPageMap;

module.exports = {
    rt: function (timingDb, data) {
        var tp = data.tp;
        var idb = timingDb[tp] = timingDb[tp] || {};
        _.forEach(data, function (v, k) {
            if (k.indexOf('rt_') !== 0) {
                return;
            }
            idb[k] = idb[k] || []; 
            idb[k].push(v); 
        });
    },
    ol: function (timingDb, data) {
        var tp = 'ol';
        var sks = showKeys[tp] || [],
            sps = showPages[tp], 
            indexDb = timingDb[tp] = timingDb[tp] || {},
            index = data.pid.replace(/%2F/g, '/'),
            idb = indexDb[index]  = indexDb[index] || {},
            i;

        //过滤页面
        if (_.indexOf(sps, index) < 0) return;
        _.forEach(data, function (v, k) {
            if (k.indexOf('rt_') === 0) {
                timingDb.rt = timingDb.rt || {};
                timingDb.rt[k] = timingDb.rt[k] || [];
                timingDb.rt[k].push(v);
            } else {
                //过滤指标
                i = _.indexOf(sks, k)
                if (i < 0) return;
                idb[k] = idb[k] || []; 
                idb[k].push(v); 
            }
        });
    },
    ax: function (timingDb, data) {
        var tp = data.tp,
            sks = showKeys[tp] || [],
            indexDb = timingDb[tp] = timingDb[tp] || {},
            index = data.url.replace(/%2F/g, '/'),
            idb = indexDb[index]  = indexDb[index] || {},
            isError = false,
            totalTime = 0,
            i;

        _.forEach(data, function (v, k) {
            //过滤非性能指标
            i = _.indexOf(['open', 'received', 'loading', 'done'], k)
            //FIXME
            if (i < 0) return;
            if (+v !== +v) {
                isError = true;
                return false;
            }
            if (_.indexOf(sks, k) > 0) {
                idb[k] = idb[k] || []; 
                idb[k].push(totalTime); 
                totalTime += (+v);
            } else {
                totalTime += (+v);
            }
        });
        if (!isError) {
            idb.total = idb.total || []
            idb.total.push(totalTime); 
        }
    },
}
