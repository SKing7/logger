
var fs = require('fs');
var csv = require('fast-csv');
var config = require('../config/config');
var cs = require('../lib/console');

var csvStream = csv.format({headers: true});
var logConfig = config.log;
var reportPath = logConfig.reportsPath;

module.exports = {
    init: function (name) {
        var fileFullPath = reportPath + name.replace(/[\/]/g, '_') + '.csv'; 
        writableStream = fs.createWriteStream(fileFullPath, {encoding: "utf8"});
        writableStream.on("finish", function(){
            cs.info('file is ready :' + fileFullPath);
            process.exit();
        });
        csvStream.pipe(writableStream);
    },
    push: function (obj) {
        csvStream.write(obj); 
    },
    end: function () {
        csvStream.end();
    }
}
