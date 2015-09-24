var fs = require('fs');
var config = require('../config/config');
var cs = require('../lib/console');
var _ = require('lodash');
var mail = require('../lib/email');
var qt = require('../lib/quartile');

var logConfig = config.log;
var pers = config.pers;
var reportPath = logConfig.reportsPath;
var env = process.env.NODE_ENV || 'dev';
var writableStream;
var mailData = [];
var poll = {};

module.exports = {
    init: function (params) {
        var _this = this;
        var time = params.time;
        this.params = params;
        this.poll = {};
    },
    write: function (type, obj) {
        var poll = this.poll;
        poll[type] = obj;
    },
    toDb: function () {
        var poll = this.poll;
	    if (env === 'production') {
        	qt.toDb(poll, this.params.time);
	    } else {
        	//qt.toDb(poll, this.params.time);
            //console.log(JSON.stringify(poll));
	    }
    }
}
