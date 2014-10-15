var path           = require('path'),
    templatesDir   = path.resolve(__dirname, '..', 'templates'),
    reportsDir   = path.resolve(__dirname, '..', 'reports'),
    config = require('../config/config').mail,
    emailTemplates = emailTemplates = require('email-templates'),
    nodemailer     = require('nodemailer');

var transport = nodemailer.createTransport(config.transport);
var cf = require('../config/config');
var pers = cf.pers;
module.exports = {
    sendTiming: function (data, reportDate) {
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                console.log(err);
            } else {
                template('timing-per', {
                    data: data,
                    pers: pers 
                }, function(err, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                        sendTiming(reportDate, html, '（分位点）');
                    }
                });
            }
        });
    }
}
function sendTiming(reportDate, content, subtitle) {
    subtitle = subtitle || '';
    transport.sendMail({
        from: config.transport.auth.user,
        to: config.to,
        cc: config.cc,
        subject: reportDate + '性能统计报表 ' + subtitle,
        html: content,
        attachments: {
            filename: reportDate + '.csv',
            path: reportsDir + '/' + reportDate + '.csv',
        },
        text: ''
    }, function(err, responseStatus) {
        if (err) {
            console.log(err);
        } else {
        }
    });
}
