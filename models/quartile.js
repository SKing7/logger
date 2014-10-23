var mongoose = require('mongoose'),
    TimeStampPlugin = require('mongoose-timestamp'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

var QuartileSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Object,
        required: true,
    },
    reportDate: {
        type: Date,
        required: true,
    },
    timingType: {
        type: String,
    },
    type: {
        type: String,
    },
});
QuartileSchema.plugin(TimeStampPlugin, {
    createdAt: 'gmtCreated',
    updatedAt: 'gmtUpdated'
});
module.exports = mongoose.model('Quartile', QuartileSchema);
