var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var fs = require('fs');
var csv = require('fast-csv');
var argv = require('optimist').argv;

var reader = require('../lib/reader');
var calc = require('../lib/calc');
var transfer = require('../lib/transfer');
var cs = require('../lib/console');
var config = require('../config/config');

var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var timingDb = {};
var startTime = mt.now();
var endTime;
var writableStream;
var csvStream;
var reportPath = logConfig;
var limit = 1000;
var count = 0;

if (env === 'dev') {
    reportPath = './';
} else {
    reportPath = logConfig.reportsPath;
}
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
eacher = reader.eacher(time);

csvStream = csv.format({headers: true}),
writableStream = fs.createWriteStream(reportPath + time + ".csv");

writableStream.on("finish", function(){
   cs.info("DONE!");
   cs.info('use time: ' + (mt.now() - startTime));
});
csvStream.pipe(writableStream);

eacher(function (data) {
    if (limit && count > limit) return false;
    var type = data.tp;
    if (_.isFunction(transfer[type])) {
        transfer[type](timingDb, data);
    }
    count++;
}).then(function () {
    endTime = mt.now();
    cs.info('read use time: ' + (endTime - startTime));
    cs.info(count + ' line logs');
    calcHub();
    csvStream.end();
});
function calcHub() {
    calc.rt(timingDb, csvStream);
    calc.ol(timingDb, csvStream);
    calc.ax(timingDb, csvStream);
}
