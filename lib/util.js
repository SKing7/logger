var dbs = [];
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
    } 
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
