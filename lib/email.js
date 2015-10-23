var cf = require('../config/config');
var cs = require('../config/task-log');

var pers = cf.pers;
var _ = require('lodash');
var fs = require('fs');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var logConfig = cf.log;
var config = cf.mail;
var templatesDir = config.templatePath;
var reportsDir = logConfig.reportsPath;
var secret = JSON.parse(fs.readFileSync(__dirname + '/../../etc/.ignore', 'utf8'));
config.transport.auth.pass = secret.p;
var transport = nodemailer.createTransport(config.transport);
module.exports = {
    sendPerTiming: function (data, rdata, radio, reportDate) {
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                cs.error(err);
            } else {
                var imgData = [
                    'index_index', 
                    'detail_index',
                    'navigation_index',
                    'navigation_buslist',
                    'search_view',
                    'search_mapview',
                ];
                _.forEach(imgData, function (v, k) {
                    imgData[k] = 'http://10.17.128.63:8990/shots/' + v + '_30d_' + reportDate + '.png'; 
                });
                template('timing-per', {
                    data: data,
                    rdata: rdata,
                    imgData: imgData,
                    rradio: radio,
                    keyMap: cf.alias.timingKeyMap,
                }, function(err, html, text) {
                    if (err) {
                        cs.error(err.message);
                    } else {
						html = (html.replace(/\r?\n|\r/g, ''));
                        send(reportDate, html, '（分位点）');
                    }
                });
            }
        });
    }
}
function send(reportDate, content, subtitle) {
    subtitle = subtitle || '';
    transport.sendMail({
        //from: config.transport.auth.user,
        from: config.transport.auth.user,
        to: config.to,
        cc: config.cc,
        subject: config.title + reportDate,
        html: content,
        attachments_back: {
            filename: reportDate + '.csv',
            path: reportsDir + reportDate + '.csv',
        },
        text: ''
    }, function(err, responseStatus) {
        if (err) {
            cs.error(err);
        } else {
        }
    });
}
function rv(s) {
	return s.split("").reverse().join("");
}
