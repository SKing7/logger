
module.exports = {
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: __dirname + '/../reports/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    mail: {
        to: process.env.NODE_ENV === 'production' ? 'zero@autonavi.com' : 'zhe.liu@autonavi.com',
        cc: 'zhe.liu@autonavi.com',
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
    timingKeyMap: {
        rt: [],
        ol: [],
        ax: ['open', 'received', 'loading', 'done'],
    },
    pers: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
}
