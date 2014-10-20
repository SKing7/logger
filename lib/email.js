var cf = require('../config/config');
var pers = cf.pers;
var _ = require('lodash');
var fs = require('fs');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var logConfig = cf.log;
var config = cf.mail;
var templatesDir = config.templatePath;
var reportsDir = logConfig.reportsPath;
var transport = nodemailer.createTransport(config.transport);

module.exports = {
    sendPerTiming: function (filePath, reportDate) {
        var data = fs.readFileSync(filePath, 'utf-8').split('\n');
        _.each(data, function (v, k) {
            data[k] = v.split(',');
        });
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                console.log(err);
            } else {
                template('timing-per', {
                    data: data,
                }, function(err, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
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
        from: config.transport.auth.user,
        to: config.to,
        cc: config.cc,
        subject: reportDate + '性能统计报表 ' + subtitle,
        html: content,
        attachments: {
            filename: reportDate + '.csv',
            path: reportsDir + reportDate + '.csv',
        },
        text: ''
    }, function(err, responseStatus) {
        if (err) {
            console.log(err);
        } else {
        }
    });
}