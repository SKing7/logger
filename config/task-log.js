var config = require('./config').runningLog;

var winston = require('winston');
var path = require('path');
var moment = require('moment');

switch (process.env.NODE_ENV) {
case 'production':
    // setup log rotate on production
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.DailyRotateFile, {
        filename: config.tasks.path,
        dirname: path.dirname(config.tasks.path),
        datePattern: '.yyyy-MM-dd',
        timestamp: function() {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        },
        colorize: true,
    });
    break;
default:
    // using colorize console logger when dev
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {colorize: true});
    break;
}
module.exports = winston;
