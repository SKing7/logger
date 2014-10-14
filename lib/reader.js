var lineReader = require('line-reader');
var moment = require('moment');
var config = require('../config/config');
var cs = require('../lib/console');
var _ = require('lodash');
var logConfig = config.log;
var prefix = logConfig.prefix;
var tRegx = logConfig.timestampRegx;
var sep = logConfig.separator;
module.exports = {
    eacher: function (time) {
        var file;
        if (!time) {
            time = moment().subtract(1, 'days').format(tRegx);
        }
        file = logConfig.path + prefix + time + '.log';
        cs.info(file);
        return function (cb) {
            var datas,
                body,
                finder,
                gmt,
                sgif,
                ua,
                type,
                refer;

            return lineReader.eachLine(file, function(line) {
                datas = line.split(sep);
                gmt = datas[2];
                sgif = datas[8];
                refer = datas[9];
                ua = datas[10];
                var timingDb = getDatas(sgif);
                return cb(timingDb);
            });
        }
    },
    allData: function () {
    }
}
function getDatas(sgif) {
    var body = timingData(sgif);
    var arrData = body.split('&');
    var tmp;
    var timingDb = {};
    _.forEach(arrData, function (v) {
        tmp = v.split('=');
        timingDb[tmp[0]] = tmp[1];
    });
    return timingDb;
    function timingData(sgif) {
        var body = sgif.split('\u0020')[1];
        body = body.substr(body.indexOf('?') + 1);
        return body;
    }
}
