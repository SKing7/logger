var outCsv = require('../lib/out_csv');
var moment = require('moment');
var _ = require('lodash');
var mongoose = require('mongoose');
var cs = require('../lib/console');
var config = require('../config/config');
var logConfig = config.log;
var tRegx = logConfig.timestampRegx;
var argv = require('optimist').argv;
var name = argv.n;
var quartileController = require('../controller/quartile');
mongoose.connect(config.db.url);
outCsv.init(name);
console.log(name);
switch (name) {
    case 'rt_navigation_index':
        quartileController.find({name: name}, function (err, rts) {
            if (err) {
                cs.error(err);
                return;
            }
            handleRt(rts);
        });
        break;
    case '/index/index/':
        quartileController.find({name: name}, function (err, rts) {
            if (err) {
                cs.error(err);
                return;
            }
            handlePage(rts);
        });
        break;
}
function handleRt(data) {
    var cf;
    _.forEach(data, function (v) {
        var cf = { 'Date': moment(v.reportDate).format(tRegx), };
        cf.A = v.value['75']; 
        outCsv.push(cf);
    });
    outCsv.end();
}
function handlePage(data) {
    var cf;
    var rt;
    rt = _.groupBy(data, function (v) {
        return moment(v.reportDate).format(tRegx) ;
    });
    _.forEach(rt, function (v, k) {
        cf = {'Date': k};
        _.forEach(v, function (v1) {
            cf[v1.timingType] = v1.value['75']; 
        });
console.log(cf);
        outCsv.push(cf);
    });
    outCsv.end();
}
