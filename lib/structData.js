var config = require('../config/config');
var _ = require('lodash');
var pageLimit = config.limit.keyMap;

module.exports = {
    locationData: function (data){
        var locationPages = pageLimit.im;
        data = _.filter(data, function (v) {
            return v.timingType.indexOf('loc_') === 0
        });
        var groupedData = _.groupBy(data, function (v) {
            return v.timingType.match(/^loc_([^_]*)_/)[1]
        });
        var tmpRt;
        _.forEach(groupedData, function (dataByOs, os) {
            tmpRt = {};
            //按页面分组
            var tmp = _.groupBy(dataByOs, 'name');
            _.forEach(tmp, function (dataByPage, page) {
                var tmpPageRt = {};
                if (locationPages.indexOf(page) < 0) { return;};
                _.forEach(dataByPage, function (v) {
                    tmpPageRt[v.timingType] = v.value.avg;
                });
                tmpRt[page] = tmpPageRt;
            });
            groupedData[os] = tmpRt;
        });
        return groupedData;
    },
    //根据原始数据得到报表需要的基础数据格式 {type: {name: {timingType}}}
    pickDataforReport: function (result) {
        var pdType;
        var pdName;
        var rt = {};
        var timingType;

        //date
        _.forEach(result, function (v, k) {
            //rt ol
            pdType = _.groupBy(v, 'type');
            _.forEach(pdType, function (v1, k1) {
                //name: /index/index....
                pdName = _.groupBy(v1, 'name');
                _.forEach(pdName, function (v2, k2) {
                    // wating,loading,fs,.....
                    _.forEach(v2, function (v3, k3) {
                        timingType = v3.timingType;
                        rt[timingType] = rt[timingType] || {};
                        rt[timingType][k2] = rt[timingType][k2] || {};
                        rt[timingType][k2][k] = {
                            data: v3.value[(config.primaryPer)* 100] || v3.value.avg,
                            count: v3.sampleCount
                        }
                    });
                });
            });
        });
        return rt;
    }
}
