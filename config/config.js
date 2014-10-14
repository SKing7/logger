module.exports = {
    log: {
        path: '/opt/webserver/logs/',
        reportsPath: __dirname + '/../reports/',
        timestampRegx: 'YYYYMMDD',
        prefix: 'access_',
        separator: '||',
    }
}
