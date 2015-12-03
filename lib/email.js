var cf = require('../config/config');
var cs = require('../config/task-log');

var pers = cf.pers;
var _ = require('lodash');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var juice = require('juice');

var logConfig = cf.log;
var config = cf.mail;
var templatesDir = config.templatePath;
var reportsDir = logConfig.reportsPath;
var imgData = cf.screenShotImgs|| [];
var transport = nodemailer.createTransport(config.transport);
module.exports = {
    sendPerTiming: function (rdata, radio, data, reportDate, indexCollections) {
        emailTemplates(templatesDir, function(err, template) {
            if (err) {
                cs.error(err);
            } else {
                imgData.forEach(function (v, k) {
                    this[k] = 'http://10.17.128.63:8990/shots/' + v + '_30d_' + reportDate + '.png'; 
                }, imgData);
                template('timing-per', {
                    data: data,
                    rdata: rdata,
                    imgData: imgData,
                    rradio: radio,
                    indexCollections: indexCollections,
                    keyMap: cf.alias.timingKeyMap,
                }, function(err, html, text) {
                    if (err) {
                        cs.error(err.message);
                    } else {
                        html = juice(html);
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
