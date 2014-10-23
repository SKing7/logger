var path = require('path');
module.exports = {
    db: {
        url: 'mongodb://127.0.0.1:27017/motiming',
    },
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: path.resolve(process.env.NODE_ENV === 'production' ? __dirname + '/../reports' : __dirname + '/..') + '/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    mail: {
        templatePath: path.resolve(__dirname + '/../templates') + '/',
        to: process.env.NODE_ENV === 'production1' ? 'Yuki@autonavi.com' : 'zhe.liu@autonavi.com',
        cc: process.env.NODE_ENV === 'production' ? 'zhe.liu@autonavi.com': '',
        transport: {
            host: 'smtp.autonavi.com',
            port: 25,
            tls: {
                rejectUnauthorized:false
            },
            auth: {
                user: 'zhe.liu@autonavi.com',
                pass: '' //lZ_123
            }
        }
    },
    limitPageMap: {
        ol: ['/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'],
    },
    timingKeyMap: {
        ol: ['la'],
        ax: ['total', 'received', 'done'],
    },
    aliasMap: {
        la: 'Full Load Time',
        received: 'Wait Time',
        done: 'Receive And Parse Time',
        total: 'API Total Time',
        fs: 'First Screen Time',
    },
    pers: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85, 0.95],
    primaryPer: 0.75,
}
