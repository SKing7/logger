var moment = require('moment');
var mt = require('microtime');
var _ = require('lodash');
var argv = require('optimist').argv;

var reader = require('../lib/reader');
var calc = require('../lib/calc');
var transfer = require('../lib/transfer');
var cs = require('../lib/console');
var config = require('../config/config');
var poll = require('../lib/out');

var env = process.env.NODE_ENV || 'dev';
var logConfig = config.log;
var time = argv.t;
var eacher;
var timingDb = {};
var startTime = mt.now();
var endTime;
var limit = 100;
var count = 0;

if (env === 'production') {
    limit = 0;
}
if (!time) {
    time = moment().subtract(1, 'days').format(logConfig.timestampRegx);
}
poll.init({
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
    endTime = mt.now();
    cs.info('read use time: ' + (endTime - startTime));
    cs.info(count + ' line logs');
    calcHub();
    poll.end();
});
function calcHub() {
    calc.rt(timingDb, poll);
    calc.ol(timingDb, poll);
    calc.ax(timingDb, poll);
}
