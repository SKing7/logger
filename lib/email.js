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
var secret = JSON.parse(fs.readFileSync(__dirname + '/../.ignore', 'utf8'));
config.transport.auth.pass = rv(secret.psalt) + secret.p + rv(secret.asalt);
var transport = nodemailer.createTransport(config.transport);

module.exports = {
    sendPerTiming: function (data, rdata, radio, reportDate) {
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                cs.error(err);
            } else {
                template('timing-per', {
                    data: data,
                    rdata: rdata,
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
