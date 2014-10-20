var path = require('path');
module.exports = {
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: path.resolve(process.env.NODE_ENV === 'production' ? __dirname + '/../reports' : __dirname + '/..') + '/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    mail: {
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to: process.env.NODE_ENV === 'production' ? 'Yuki@autonavi.com' : 'zhe.liu@autonavi.com',
        cc: process.env.NODE_ENV === 'production' ? 'zhe.liu@autonavi.com': '',
        transport: {
            host: 'smtp.autonavi.com',
            port: 25,
            tls: {
                rejectUnauthorized:false
            },
            auth: {
                user: 'zhe.liu@autonavi.com',
                pass: ''
            }
        }
    },
    limitPageMap: {
        ol: ['/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'],
    },
    timingKeyMap: {
        ol: ['dl', 'la'],
        ax: ['total'],
    },
    pers: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
}
