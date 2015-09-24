var _ = require('lodash');
var config = require('../config/config');
var pers = config.pers;
var showKeys = config.limit.timingKeyMap;
var higherBetter = config.higherBetter;

module.exports = {
    combine: function (db, poll) {
        var data = db.combine;
        var result = {};
        var sortedData;
        _.forEach(data, function (v, k) {
            sortedData = v.sort(function (v1, v2) {
                return v1 - v2;
            });
            result[k] = {};
            result[k].c_fsp = {};
            byPer(sortedData, result[k].c_fsp);
        })
        poll.write('combine', result);
    },
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
    ex: function (db, poll) {
        var data = db.ex;
        var result = {};
        var sortedData;
        var resNotCachedCountMap = {};
        var registerMap = {};
        _.forEach(data, function (v, k) {
            //k: page index
            result[k] = {};
            //重置
            registerMap.loc = {};
            _.forEach(v, function (v1, k1) {
                //k1: cchr
                //v1 某个页面对应的命中率数据
                handleHub(v1, k1, result[k]);
            });
            _.assign(result[k], {
                loc_android_ip_failure: avgByState(registerMap.loc, 'loc_android_ip', 'f', '^loc_android'),
                loc_android_other_failure: avgByState(registerMap.loc, 'loc_android_other', 'f', '^loc_android'),
                loc_ios_ip_failure: avgByState(registerMap.loc, 'loc_ios_ip', 'f', '^loc_ios'),
                loc_ios_other_failure: avgByState(registerMap.loc, 'loc_ios_other', 'f', '^loc_ios'),
            });
        });
        var totalRadio = { 
            cchr: avgAllItem(result, 'cchr'),
        };
        result['__total__'] = totalRadio; 
        poll.write('ex', result);
        //console.log(result);
        function handleHub(dset, type, targetObj) {
            var index; 
            var arr;
            var numberValue;
            var tempArr;
            //TODO 通过计算类型来进行分类
            if (type === 'cchr') {
                _.forEach(dset, function (v, k) {
                    //v 为 0 %2F 2 %3B a.js,b,js
                    arr = v.split('%3B');
                    if (arr.length === 2) {
                        numberValue = arr[0];
                        calcNoCachedMap(arr[1]);
                    } else if (arr.length === 1){
                        numberValue = v;
                    } else {
                        return;
                    }
                    //tmp 为 0/2
                    //%2F
                    dset[k] = numberValue;
                });
                avgItemOfFraction(dset, targetObj[type]={});
            //数量根据type进行聚合
            } else if (type && type.indexOf('loc_') >= 0){
                var config = type.split('_');
                //loc_system_type  至少为3
                if (config.length < 3) return;
                var systemType = config[1];
                registerMap.loc[type] = registerMap.loc[type] || {};
                var curried = currying(handleBySystem, systemType, registerMap.loc[type]);

                _.forEach(dset, function (v) {
                    curried(v);
                });
                //var tmpItem = registerMap[systemType];
                //targetObj[config.slice(0, 2).join('_')] = {
                //   data: {avg: point((tmpItem.s || 0) / ((tmpItem.s || 0) + (tmpItem.f || 0)))},
                //   count: dset.length
                //}
            }
            function handleBySystem(system, targetObj, state) {
                if (state === '1') {
                    targetObj.s =  ++targetObj.s || 1;
                } else if (state === '0'){
                    targetObj.f =  ++targetObj.f || 1;
                }
            }
            function calcNoCachedMap(v) {
                var va = v.split('%2C');
                _.forEach(va, function (v) {
                    resNotCachedCountMap[v] = resNotCachedCountMap[v] || 0;
                    resNotCachedCountMap[v]++;
                });
            }
        }
    },
	aveOf7days: function (data) {
		var result = {};
		var ave = {};
        var value;
		_.forEach(data, function (v1, k1) {
			result[v1.timingType] = result[v1.timingType] || {};
			result[v1.timingType][v1.name] = result[v1.timingType][v1.name] || [];
            value = v1.value;;
			result[v1.timingType][v1.name].push(+(value[config.primaryPer * 100] || value.avg));
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
                //只有十位数以上，才保留整数
                if (total > v1.length * 10) {
				    ave[k][k1] = Math.ceil(total / v1.length);
                } else {
				    ave[k][k1] = parseInt(total * 10000/ v1.length) / 10000;
                }
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
					radio[k][k1] = showTrend(difRadio, k);
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
                if (thatData) {
                    thatData = thatData.data;
                }
    	        // k2:thatDay,preDay
    	        _.forEach(v1, function (v2, k2) {
    	            //没有当天数据
    	            if (!thatData) {
    	                v1[k2] = '';
    	                return;
    	            }
    	            if (k2 !== 'thatDay') {
    	                //百分比 精确到小数点一位
    	                dif = thatData -v2.data;
    	                difRadio = parseInt(dif * 1000/ v2.data) / 10;
					    v1[k2] = showTrend(difRadio, k);
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
function point(v) {
    return  parseInt(v * 10000) / 10000
}
function showTrend(difRadio, timingType) {
    var dropClass = 'drop';
    var upClass = 'error';
    if (_.indexOf(higherBetter, timingType) >= 0) {
        dropClass = 'error';
        upClass = 'drop';
    }
    if (difRadio <= -5) {
        difRadio = '<em class="' + dropClass + '">' + difRadio + '%</em>';
    } else if (difRadio >= 5) {
        difRadio = '<em class="' + upClass+ '">' + difRadio + '%</em>';
    } else {
        difRadio = difRadio + '%';
    }
    return difRadio;
}
//TODO 返回所有项计算的平均值
function avgAllItem(d, timingName) {
    var obj = {};
    obj.data = {};
    obj.count = d.length;
    var total = 0
    var count = 0
    _.forEach(d, function (per) {
        var data = per[timingName];
        if (!data || !data.count) return;
        total += data.data.avg * data.count;
        count += data.count;
    });
    obj.count = count;
    if (!count) {
        obj.data.avg = undefined;
    } else {
        obj.data.avg = point(total / count);
    }
    return  obj;
}
function getTotalByGroupOfExp (data, groupExp) {
    data = _.clone(data, true);
    var totalResult = _.reduce(data, function (result, v, k) {
        var matched = k.match(new RegExp(groupExp));
        if (matched) {
            sumByKey(v, result);
        }
        return result;
    });
    function sumByKey(obj, result) {
        _.forEach(obj, function (v, k) {
            result[k] = result[k] || 0; 
            result[k] += (+v || 0); 
        });
    }
    return totalResult;
}
function avgByState(data, index, numerator, highGroupExp) {

    var info = {
        data: {avg: 0},
        count: 0
    };
    if (!data || !data[index]) return info;
    var totalObj = getTotalByGroupOfExp(data, highGroupExp);
    var totalNum = sumObj(totalObj);
    var avg = point(data[index][numerator] / totalNum); 
    info.data.avg = avg;
    info.count = totalNum;
    return info;
    function sumObj(obj) {
        var total = 0;
        _.forEach(obj, function (v) {
            total += v; 
        });
        return total;
    }

}
function avgItemOfFraction(d, obj) {
    d = _.compact(d);
    if (!d.length) return;
    var totalRadio = 0;
    obj.data = {};
    obj.count = d.length;
    var tmpArr;
    var count = 0;
    _.forEach(d, function (per) {
        tmpArr = per.split('%2F');
        if (tmpArr.length !== 2 || isNaN(tmpArr[0]) || isNaN(tmpArr[1]) || tmpArr[0] < 0 || tmpArr[1] <= 0) {
            return true;
        }
        totalRadio += tmpArr[0] / tmpArr[1];
        if (isNaN(totalRadio)) {
            console.log(tmpArr);
            return true;
        }
        count++;
    });
    obj.count = count;
    var avg = point(1 - totalRadio / count);
    if (avg >= 0) {
        obj.data.avg = avg;
    }
}
function avgItemOfPlus(data, targetObj) {
    targetObj.data = {};
    targetObj.count = data.length;
}
function currying (fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat([].slice.call(arguments));
        return fn.apply(null, newArgs);
    };
};

