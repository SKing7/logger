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
    sendPerTiming: function (data, rdata, reportDate) {
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                console.log(err);
            } else {
                template('timing-per', {
                    data: data,
                    rdata: rdata,
                    keyMap: cf.alias.timingKeyMap,
                }, function(err, html, text) {
					html = (html.replace(/\r?\n|\r/g, ''));
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
            console.log(err);
        } else {
        }
    });
}
