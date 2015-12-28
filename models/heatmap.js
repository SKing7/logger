
var mongoose = require('mongoose'),
    TimeStampPlugin = require('mongoose-timestamp'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

var SchemaInstance = new Schema({
    pid: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Object,
        required: true,
    },
    happenAt: {
        type: String,
        required: true,
    },
    reportDate: {
        type: Date,
        required: true,
    },
    aid: {
        type: String,
    },
});
SchemaInstance.plugin(TimeStampPlugin, {
    createdAt: 'gmtCreated',
    updatedAt: 'gmtUpdated'
});
module.exports = mongoose.model('HeatMap', SchemaInstance);
