var _ = require('lodash');

var config = require('../config/config');

var showKeys = config.timingKeyMap;

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
        var tp = data.tp,
            sks = showKeys[tp] || [],
            indexDb = timingDb[tp] = timingDb[tp] || {},
            index = data.pid,
            idb = indexDb[index]  = indexDb[index] || {},
            i;

        index = index.replace(/%2F/g, '/');
        _.forEach(data, function (v, k) {
            if (k.indexOf('rt_') === 0) {
                timingDb.rt = timingDb.rt || {};
                timingDb.rt[k] = timingDb.rt[k] || [];
                timingDb.rt[k].push(v);
            } else {
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
            totalTime = 0,
            i;

        _.forEach(data, function (v, k) {
            i = _.indexOf(sks, k)
            if (i < 0) return;
            idb[k] = idb[k] || []; 
            idb[k].push(v); 
            totalTime += (+v);
        });
        idb.total = idb.total || []
        idb.total.push(totalTime); 
    },
}
