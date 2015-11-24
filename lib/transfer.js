var _ = require('lodash');

var config = require('../config/config');

var showKeys = config.limit.timingKeyMap;
var showPages = config.limit.keyMap;

module.exports = {
    //rt类型不区分页面
    rt: function (timingDb, data) {
        var tp = data.tp;
        var idb = timingDb[tp] = timingDb[tp] || {};
        var index;
        var name;
        _.forEach(data, function (v, k) {
            if (k.indexOf('rt_') !== 0) {
                return;
            }
            //hack 定位指标 指向im,计算方式不同于普通指标
            if (k.indexOf('rt_gl') === 0) {
                index = fixUrl(data.pid),
                name = k.substr(3);
                timingDb.im = timingDb.im || {};
                timingDb.im[index] = timingDb.im[index] || {};
                timingDb.im[index][name] = timingDb.im[index][name] || [];
                timingDb.im[index][name].push(v);
            } else {
                idb[k] = idb[k] || []; 
                idb[k].push(v); 
            }
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
        var timing = getTiming(data);
        _.assign(timing, data);
        _.forEach(timing, function (v, k) {
            if (k.indexOf('rt_') === 0) {
                timingDb.rt = timingDb.rt || {};
                timingDb.rt[k] = timingDb.rt[k] || [];
                timingDb.rt[k].push(v);
            } else if (k.indexOf('ex_') === 0) {
                var exName = k.substr(k.indexOf('ex_') + 3);
                timingDb.ex = timingDb.ex || {};
                timingDb.ex[index] = timingDb.ex[index] || {};
                timingDb.ex[index][exName] = timingDb.ex[index][exName] || [];
                timingDb.ex[index][exName].push(v);
            } else {
                i = _.indexOf(sks, k)
                if (i >= 0) {
                    idb[k] = idb[k] || []; 
                    idb[k].push(v); 
                }
            }
        });
    },
    ax: function (timingDb, data) {
        var tp = data.tp,
            sks = showKeys[tp] || [],
            indexDb = timingDb[tp] = timingDb[tp] || {},
            index,
            idb,
            isError = false,
            totalTime = 0,
            i;
        if (!data.url) return;
        index = data.url.replace(/%2F/g, '/')
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
    combineIndicator: function (timingDb) {
        var ol = timingDb.ol; 
        var rt = timingDb.rt; 
        var base = {};
        _.forEach(ol, function (v, k) {
            base[k] = v;
        });
        timingDb.combine = {};
        var pageIndex;
        _.forEach(rt, function (v, k) {
            //rt_xx_xx -> /xx/xx/
            k = k.substr(2).replace(/_/g, '/') + '/';
            if (base[k] && Object.prototype.toString.call(base[k].fsp_mixed) === '[object Array]') {
                timingDb.combine[k] = base[k].fsp_mixed.concat(v);
            } else {
                timingDb.combine[k] = v;
            }
        });
    }
}
function fixUrl(url) {
    if (!url) {
        return '';
    }
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
function getTiming(timing) {
    var api = {};
    sub('loadTime',timing.le || timing.ls, 0)
    // Time spent constructing the DOM tree
    sub('domReadyTime',timing.de, timing.di)
    // Time consumed prepaing the new page
    sub('readyStart',timing.fs, 0)
    // Time spent during redirection
    sub('redirectTime',timing.rde || 0, timing.rds || 0)
    // AppCache
    sub('appcacheTime',timing.dls, timing.fs)
    // DNS query time ?
    sub('lookupDomainTime',timing.dle, timing.dls)
    // TCP connection time ?
    sub('connectTime',timing.ce, timing.cs)
    // Time spent during the request
    sub('requestTime',timing.rse, timing.rss)
    // Request to completion of the DOM loading
    sub('initDomTreeTime',timing.di, timing.rse)
    // Load event time
    sub('loadEventTime',timing.le, timing.ls)
    //计算 fsp+预渲染服务端的总和作为首屏的记录
    if (!isNaN(timing.fsp)) {
        if (isNaN(timing.ssrct)) {
            timing.fsp_mixed = timing.fsp;
        } else {
            plus('fsp_mixed', timing.fsp, timing.ssrct)
        }
    }
    return api;
    function sub (k, a, b) {
        if (!isNaN(parseInt(a)) && !isNaN(parseInt(b))) {
            api[k] = a - b;
        }
    }
    function plus (k, a, b) {
        if (!isNaN(parseInt(a)) && !isNaN(parseInt(b))) {
            api[k] = +a + (+b);
        }
    }
}
