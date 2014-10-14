
module.exports = {
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: __dirname + '/../reports/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    },
    timingKeyMap: {
        rt: [],
        ol: [],
        ax: ['open', 'received', 'loading', 'done'],
    },
    pers: [0.5, 0.9]
}
