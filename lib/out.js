var fs = require('fs');
var config = require('../config/config');
var cs = require('../lib/console');
var _ = require('lodash');
var csv = require('fast-csv');
var mail = require('../lib/email');

var logConfig = config.log;
var pers = config.pers;
var reportPath = logConfig.reportsPath;
var csvStream = csv.format({headers: true});
var writableStream;
var mailData = [];
var poll = {};

module.exports = {
    poll: poll,
    init: function (params) {
        var _this = this;
        var time = params.time;
        var fileFullPath = reportPath + time + '.csv'; 
        writableStream = fs.createWriteStream(fileFullPath, {encoding: "utf8"});
        writableStream.on("finish", function(data){
            cs.info('email attachment file:' + fileFullPath);
            mail.sendPerTiming(fileFullPath, time);
        });
        csvStream.pipe(writableStream);
    },
    write: function (type, obj) {
        poll[type] = obj;
    },
    end: function () {
        outPer(poll);
        console.log(_.keys(poll.ol));
        csvStream.end();
    }
}
function outPer(result) {
    var obj;
    var alias = config.aliasMap;
    _.forEach(result, function (v, k) {
        obj = {};
        _.forEach(v, function (v1, k1) {
            obj['key'] = k1;
            _.forEach(v1, function (v2, k2) {
                // v2 => {data:..., count: ...}
                _.forEach(pers, function (v3) {
                    obj[v3 * 100 + '%'] = v2.data[v3];
                });
                obj['指标描述'] = alias[k2] || k2;
                obj['样本数'] = v2.count;
                csvStream.write(obj);
            });
        });
    });
}
