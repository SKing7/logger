var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});
module.exports = {
    info: function (msg) {
        console.log(('INFO: ' + msg).info);
    },
    error: function (msg) {
        console.log(('ERROR: ' + msg).error);
    },
    warn: function (msg) {
        console.log(('WARN: ' + msg).warn);
    }
}
