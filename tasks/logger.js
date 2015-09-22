var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var argv = require('optimist').argv;
var auditLog = require('audit-log');
var mongoose = require('mongoose');

var reader = require('../lib/reader');
var calc = require('../lib/calc');
var transfer = require('../lib/transfer');
var cs = require('../config/task-log');
var config = require('../config/config');
var out = require('../lib/out');

var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var timingDb = {};
var startTime = mt.now();
var endTime;
var limit = 0;
var count = 0;

auditLog.addTransport("mongoose", {connectionString: config.db.url});
mongoose.connect(config.db.url);
if (env === 'production') {
    limit = 0;
}
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
out.init({
    time: time
});
eacher = reader.eacher(time);
eacher(function (data) {
    if (limit && count > limit) return false;
    var type = data.tp;
    if (_.isFunction(transfer[type])) {
        transfer[type](timingDb, data);
    }
    count++;
}).then(function () {
    transfer.combineIndicator(timingDb);
    endTime = mt.now();
    cs.info('read use time: ' + (endTime - startTime));
    cs.info(count + ' line logs');
    calcHub();
    out.toDb();
    setTimeout(function () {
        process.exit();
    }, 10000)
});
function calcHub() {
    calc.rt(timingDb, out);
    calc.ol(timingDb, out);
    calc.ax(timingDb, out);
    calc.ex(timingDb, out);
    calc.combine(timingDb, out);
}
