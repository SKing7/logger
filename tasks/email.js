var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
  , emailTemplates = emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

emailTemplates(templatesDir, function(err, template) {
    if (err) {
        console.log(err);
    } else {
        var transport = nodemailer.createTransport({
            service: "QQ",
            auth: {
                user: "602571914@qq.com",
                pass: ""
            }
        });
        var locals = {
            email: 'zero@autonavi.com',
            name: {
                first: 'liu',
                last: 'zhe'
            }
        };

        // Send a single email
        template('timing-per', locals, function(err, html, text) {
          if (err) {
              console.log(err);
          } else {
              transport.sendMail({
                  from: '602571914@qq.com',
                  to: locals.email,
                  cc: 'zhe.liu@autonavi.com',
                  subject: '20141013性能统计报表',
                  html: '',
                  attachments: {
                    filename: '20141013.csv',
                    path: '/home/logger/analyzer/reports/20141013.csv',
                  },
                  text: 'auto by log server.'
              }, function(err, responseStatus) {
                  if (err) {
                      console.log(err);
                  } else {
                  }
              });
          }
        });
    }
});

