var fs = require('fs');
var cs = require('../lib/console');
var _ = require('lodash');
var csv = require('fast-csv');

var mail = require('../lib/email');
var csvStream = csv.format({headers: true});
var writableStream;

var poll = [];
module.exports = {
    poll: poll,
    init: function (params) {
        var _this = this;
        this.params = params;
        writableStream = fs.createWriteStream(params.filePath);
        writableStream.on("finish", function(data){
           cs.info("DONE!");
           mail.sendTiming(poll, _this.params.time);
        });
        csvStream.pipe(writableStream);
    },
    write: function (obj) {
        poll.push(obj);
    },
    end: function () {
        _.forEach(poll, function (v, k) {
            csvStream.write(v);
        });
        csvStream.end();
    }
}
