var qt = require('../lib/quartile');
var env = process.env.NODE_ENV || 'dev';

module.exports = {
    init: function (params) {
        var _this = this;
        var time = params.time;
        this.params = params;
        this.poll = {};
    },
    write: function (type, obj) {
        var poll = this.poll;
        poll[type] = obj;
    },
    clear: function () {
        this.poll = {};
    },
    toDb: function (primaryKeys) {
        var poll = this.poll;
	    if (env === 'production') {
        	qt.toDb(poll, this.params.time, primaryKeys);
	    } else {
        	qt.toDb(poll, this.params.time, primaryKeys);
	    }
        this.clear();
    },
    toDbOfModel: function (modelName, time, data) {
        var qt = require('./' + modelName).toDb(time, data);
    },

}
