var outCsv = require('../lib/out_csv');
var moment = require('moment');
var _ = require('lodash');
var mongoose = require('mongoose');
var cs = require('../lib/console');
var config = require('../config/config');
var logConfig = config.log;
var tRegx = logConfig.timestampRegx;
var argv = require('optimist').argv;
var option = argv.o;
var name = argv.n;
var quartileController = require('../controller/quartile');
mongoose.connect(config.db.url);
outCsv.init(name);
switch (option) {
    case 'rt':
        quartileController.find({name: name}, function (err, rts) {
            if (err) {
                cs.error(err);
                return;
            }
            handlePage(rts);
        });
        break;
    case 'page':
        quartileController.find({name: {$in: [name, pg2rt(name)]}}, function (err, rts) {
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
        cf.dl = cf.dl || 0;
        outCsv.push(cf);
    });
    outCsv.end();
}
function pg2rt(pg) {
    return ('rt' + name).replace(/\//g, '_').substr(0, name.length + 1);
}
