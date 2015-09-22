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
var pageApis = {
    '/search/view/': ['/service/poi/keywords.json'],
    '/detail/index/': ['/service/valueadded/infosearch.json'],
};
mongoose.connect(config.db.url);
switch (option) {
    case 'page':
        outCsv.init(name);
        quartileController.find({
            name: { $in: [name, pg2rt(name)].concat(pageApis[name] || []) },
            timingType: { $in: config.showInChart },
        }, function (err, rts) {
            if (err) {
                cs.error(err);
                return;
            }
            handlePage(rts);
        });
        break;
    case 'page_30d':
        outCsv.init(name + '30d');
        quartileController.find({
            name: { $in: [name, pg2rt(name)].concat(pageApis[name] || []) },
            timingType: { $in: config.showInChart },
            reportDate: { $gt: new Date(moment().subtract(31, 'days')), $lt: new Date() },
        }, function (err, rts) {
            if (err) {
                cs.error(err);
                return;
            }
            handlePage(rts);
        });
        break;
}
function handlePage(data) {
    var cf;
    var rt;
    var alias = config.alias.timingKeyMap;
    rt = _.groupBy(data, function (v) {
        return moment(v.reportDate).format(tRegx) ;
    });
    _.forEach(rt, function (v, k) {
        cf = {'Date': k};
        cf[alias.dl] = 0;
        cf[alias.c_fsp] = 0;
        _.forEach(v, function (v1) {
            cf[alias[v1.timingType] || v1.timingType] = v1.value['75']; 
        });
        delete cf[alias.la];
        outCsv.push(cf);
    });
    outCsv.end();
}
function pg2rt(pg) {
    return ('rt' + name).replace(/\//g, '_').substr(0, name.length + 1);
}
