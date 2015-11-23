var dbs = [];
var config = require('../config/config');
var _ = require('lodash');
module.exports = {
    getKeys: function () {
        return Object.keys(getPrimaryKeys({}));
    },
    getDbByLineData: function (line) {
        return findDbByPrimaryKey(line);
    },
    getAllDbs: function () {
        return dbs;
    },
    //针对一级timingType的key转化为显示的alias值
    sortAndAliasTimingType: function (rt) {
        var orderConfig = config.order;
        var timingAlias = config.alias.timingKeyMap;
        var keyAlias = config.alias.keyMap;
        var aliased = {};
        //timing: {}
        var ordered = {};
        _.forEach(orderConfig.timingTypesOrder, function (v, k) {
            if (rt[v]) {
                ordered[v] = rt[v];
            }
        });
        rt = ordered;
        _.forEach(rt, function (v1, k1) {
            ordered = {};
            //k1: fs,waiting
            _.forEach(orderConfig.keysOrder, function (v2, k2) {
                if (v1[v2]) {
                    ordered[keyAlias[v2] || v2] = v1[v2];
                }
            });
            aliased[timingAlias[k1] || k1] = ordered;
        })
        return aliased;
    },
}
function getPrimaryKeys (line) {
    return {
        aid: line.aid
    };
}
function findDbByPrimaryKey(line) {
    //在已有db集合中找到对应的db object
    var keysObj = getPrimaryKeys(line); 
    var db = _.find(dbs, getPrimaryKeys(line));
    if (!db) {
        db = {}; 
        keysObj.instance = db;
        dbs.push(keysObj);
    } else {
        db = db.instance;
    }
    return db;
}
