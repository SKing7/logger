var _ = require('lodash');

var config = require('../config/config');

var showKeys = config.limit.timingKeyMap;
var showPages = config.limit.keyMap;

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
            index = fixUrl(data.pid),
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
            idb,
            isError = false,
            totalTime = 0,
            i;

        if (!index) return;
        idb = indexDb[index]  = indexDb[index] || {};
        var curTotal = 0;
        _.forEach(data, function (v, k) {
            //过滤非性能指标
            i = _.indexOf(['open', 'received', 'loading', 'done'], k)
            if (i < 0) return;
            //FIXME
            if (+v !== +v) {
                isError = true;
                return false;
            }
            //依赖顺序
            totalTime += (+v);
            curTotal += (+v);
            if (_.indexOf(sks, k) > 0) {
                idb[k] = idb[k] || []; 
                idb[k].push(curTotal); 
                curTotal = 0;
            }
        });
        if (!isError) {
            idb.total = idb.total || []
            idb.total.push(totalTime); 
        }
    },
}
function fixUrl(url) {
    url = url.replace(/%2F/g, '/');
    if (url.indexOf('/') !== 0) {
        url = '/' + url;
    }
    //FIXME
    if (url.lastIndexOf('/') !== url.length - 1) {
        url += '/';
    }
    return url
}
