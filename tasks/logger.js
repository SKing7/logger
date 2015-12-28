var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var argv = require('optimist').argv;
var auditLog = require('audit-log');
var mongoose = require('mongoose');

var reader = require('../lib/reader');
var calc = require('../lib/calc');
var util = require('../lib/util');
var transfer = require('../lib/transfer');
var cs = require('../config/task-log');
var config = require('../config/config');
var out = require('../lib/out');
var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var startTime = mt.now();
var endTime;
var limit = 1000;
var count = 0;
var aid = global._aid;

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
        transfer[type](util.getDbByLineData(data), data);
    }
    count++;
}).then(function () {
    var keys = util.getKeys();
    endTime = mt.now();
    cs.info('read use time: ' + (endTime - startTime));
    cs.info(count + ' line logs');
    var allDbs = util.getAllDbs();
    allDbs.forEach(function (v, k) {
        if (aid === +v.aid) {
            var db = v.instance;
            transfer.combineIndicator(db);
            calcHub(db, out);
            out.toDb(_.pick(v, keys));
        } else {
        }
    });
    cs.info('calc use time: ' + (mt.now() - endTime));
    //TODO
    setTimeout(function () {
        process.exit();
    }, 10000)

    function calcHub(timingDb, out) {
        calc.rt(timingDb, out);
        calc.ol(timingDb, out);
        calc.ax(timingDb, out);
        calc.im(timingDb, out);
        calc.ex(timingDb, out);
        calc.combine(timingDb, out);
    }
});
