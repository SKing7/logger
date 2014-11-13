var _ = require('lodash');
var config = require('../config/config');
var pers = config.pers;
var showKeys = config.limit.timingKeyMap;

module.exports = {
    rt: function (db, poll) {
        var data = db.rt;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            sortedData = v.sort(function (v1, v2) {
                return v1 - v2;
            });
            result[k] = {};
            result[k].fs = {};
            byPer(sortedData, result[k].fs);
        })
        poll.write('rt', result);
    },
    ol: function (db, poll) {
        var data = db.ol;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            result[k] = {};
            _.forEach(v, function (v1, k1) {
                result[k][k1] = {};
                sortedData = v1.sort(function (v1, v2) {
                    return v1 - v2;
                });
                byPer(sortedData, result[k][k1]);
            });
        });
        poll.write('ol', result);
    },
    ax: function (db, poll) {
        var data = db.ax;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            result[k] = {};
            _.forEach(v, function (v1, k1) {
                result[k][k1] = {};
                sortedData = v1.sort(function (v1, v2) {
                    return v1 - v2;
                });
                byPer(sortedData, result[k][k1]);
            });
        });
        poll.write('ax', result);
    },
	aveOf7days: function (data) {
		var result = {};
		var ave = {};
		_.forEach(data, function (v1, k1) {
			result[v1.timingType] = result[v1.timingType] || {};
			result[v1.timingType][v1.name] = result[v1.timingType][v1.name] || [];
			result[v1.timingType][v1.name].push(+v1.value[config.primaryPer * 100]);
		});
		var total;
		_.forEach(result, function (v, k) {
			_.forEach(v, function (v1, k1) {
				total = 0;
				if (!v1.length) return;
				_.forEach(v1, function (v2) {
					total += v2;
				});
				ave[k] = ave[k] || {};
				ave[k][k1] = Math.ceil(total / v1.length);
			});
		});
		return ave;
	},
	timingRadio: function (base, now) {
		var radio = {};
    	_.forEach(now, function (v, k) {
			radio[k] = radio[k] || {};
    		_.forEach(v, function (v1, k1) {
				if (base[k] && base[k][k1]) {
					var difRadio =  parseInt((now[k][k1] - base[k][k1]) * 1000/base[k][k1], 10) / 10;
					if (difRadio < -10) {
						difRadio = '<em class="drop">' + difRadio + '</em>';
					}
					if (difRadio >= 10) {
						difRadio = '<em class="error">' + difRadio + '</em>';
					}
					radio[k][k1] = difRadio + '%';
				}
    		});
    	});
		return radio;
	},
	relativeRadio: function (data) {
    	var thatData;
    	var dif;
    	var difRadio;
    	_.forEach(data, function (v, k) {
    	    _.forEach(v, function (v1, k1) {
    	        thatData = v1.thatDay;
    	        // k2:thatDay,preDay
    	        _.forEach(v1, function (v2, k2) {
    	            //没有当天数据
    	            if (!thatData) {
    	                v1[k2] = '';
    	                return;
    	            }
    	            if (k2 !== 'thatDay') {
    	                //百分比 精确到小数点一位
    	                dif = thatData -v2;
    	                difRadio = parseInt(dif * 1000/ v2) / 10;
    	                v1[k2] = difRadio + '%'
    	                if (difRadio <= -10) {
    	                    v1[k2] = '<em class="drop">' + v1[k2] + '</em>';
    	                }
    	                if (difRadio >= 10) {
    	                    v1[k2] = '<em class="error">' + v1[k2] + '</em>';
    	                }
    	                //+ ('(' + v2 + ')'); 
    	            }
    	        });
    	    });
    	});
    	return data;
	}

}
function byPer(sortedData, obj) {
    var tmpData;
    var index; 
    var len = sortedData.length;
    obj.data = {};
    obj.count = sortedData.length;
    _.forEach(pers, function (per) {
        index = Math.floor(len * per); 
        if (per === 1) {
            index = index - 1;
        }
        obj.data[parseInt(per * 100, 10)] = sortedData[index];
    });
}
