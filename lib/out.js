var fs = require('fs');
var config = require('../config/config');
var cs = require('../lib/console');
var _ = require('lodash');
var csv = require('fast-csv');
var mail = require('../lib/email');
var qt = require('../lib/quartile');

var logConfig = config.log;
var pers = config.pers;
var reportPath = logConfig.reportsPath;
var csvStream = csv.format({headers: true});
var env = process.env.NODE_ENV || 'dev';
var writableStream;
var mailData = [];
var poll = {};

module.exports = {
    init: function (params) {
        var _this = this;
        var time = params.time;
        //var fileFullPath = reportPath + time + '.csv'; 
        //writableStream = fs.createWriteStream(fileFullPath, {encoding: "utf8"});
        //writableStream.on("finish", function(){
        //    cs.info('email attachment file:' + fileFullPath);
        //});
        //csvStream.pipe(writableStream);
        //csvStream.end();
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
	    	console.log(poll.ax['/service/valueadded/infosearch.json']);
	    }
    }
}
