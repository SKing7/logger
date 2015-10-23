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
        var that = this;
        var result = {};
        var sortedData;
        //console.log(JSON.stringify(data));
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
    im: function (db, poll) {
        //临时只是针对定位
        var data = db.im;
        var locData = this.formatLocationIndexes(data);
        updateToDb(locData);

        function updateToDb(tmpData) {
            var result = {};
            _.forEach(tmpData, function (data, page) {
                result[page] = {};
                _.forEach(data, function (v, k) {
                    if (k.indexOf('t_') === 0) {
                        var sortedData = v.sort(function (v1, v2) {
                            return v1 - v2;
                        });
                        result[page][k] = {};
                        byPer(sortedData, result[page][k]);
                    } else {
                        result[page][k] = v;
                    }
                })
            })
            poll.write('im', result);
        }
    },
    formatLocationIndexes: function (data) {
        var locationData = this.groupByRegx(data, /gl_([^_]+)/);
        //console.log(JSON.stringify(locationData));
        var that = this;
        var tmpData = {};
        _.forEach(locationData, function (pData, page) {
            tmpData[page] = tmpData[page] || {};
            //定位时间
            tmpData[page].t_loc_android = that.mergeArray(pData.android, /_su$/);
            tmpData[page].t_loc_ios = that.mergeArray(pData.ios, /_su$/);
            //ip定位失败率
            tmpData[page].loc_android_ip_failure = calRate(pData.android, /_ip_fa$/);
            tmpData[page].loc_ios_ip_failure = calRate(pData.ios, /_ip_fa$/);
            //other定位失败率: ip成功和失败的比例就是其他类型失败的比例
            tmpData[page].loc_android_other_failure = calRate(pData.android, /_ip_(su|fa)$/);
            tmpData[page].loc_ios_other_failure = calRate(pData.ios, /_ip_(su|fa)$/);
            //定位成功率率: h5
            tmpData[page].loc_android_glh_success = calRate(pData.android, /_glh_su$/);
            tmpData[page].loc_ios_glh_success = calRate(pData.ios, /_glh_su$/);
            //定位成功率率: AmapService
            tmpData[page].loc_android_ams_success = calRate(pData.android, /_ams_su$/);
            //tmpData[page].loc_ios_ams_success = calRate(pData.ios, /_ams_su$/);
            //定位成功率率: UC
            tmpData[page].loc_android_ugi_success = calRate(pData.android, /_ugi_su$/);
            tmpData[page].loc_ios_ugi_success = calRate(pData.ios, /_ugi_su$/);
        });
        //ip定位失败比例
        return tmpData;
        //regx 匹配出要计算比例的key的正则
        //data 各个group下细分index的数据
        function calRate(data, regx) {
            var rt = {count: 0, data: {avg: 0}};
            var targetLen = that.mergeArray(data, regx).length;
            var totalLen = that.getLenOfObjectChildArray(data); 
            if (!totalLen) {
                return rt;
            }
            rt.count = totalLen;
            rt.data.avg = point(targetLen / totalLen);
            return rt;
        }
    },
    getLenOfObjectChildArray: function (obj) {
        var len = 0;
        _.forEach(obj, function (v) {
            if (v && v.length) {
                len += v.length;
            }
        });
        return len;
    },
    //把key符合regx的array，进行合并
    mergeArray: function (data, regx) {
        var rt = [];
        _.forEach(data, function (v, k) {
            if (regx.test(k)) {
                rt = rt.concat(v);
            }
        });
        return rt;
    },
    groupByRegx: function (data, groupRegx) {
        var newData = {};
        _.forEach(data, function (pData, p) {
            //pageDetailData
            _.forEach(pData, function (v, index) {
                var groupName; 
                var matched = index.match(groupRegx);
                if (matched) {
                    groupName = matched[1];
                    newData[p] = newData[p] || {};
                    newData[p][groupName] = newData[p][groupName] || {};
                    newData[p][groupName][index] = v;
                }
            });
        });
        return newData;
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
        _.forEach(data, function (v, k) {
            //k: page index
            result[k] = {};
            //重置
            _.forEach(v, function (v1, k1) {
                //k1: cchr
                //v1 某个页面对应的命中率数据
                handleHub(v1, k1, result[k]);
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
    //{ loc_ios_ip: { s: 20, f: 5 }, loc_ios_other: { f: 3 }, loc_android_other: { f: 2 }, loc_android_ip: { s: 15 } }
    //exp: loc_android'
    var result = {};
    _.forEach(data, function (v, k) {
        var matched = k.match(new RegExp(groupExp));
        if (matched) {
            // 符合groupExp的对象根据key（f,s）进行相加
            sumByKey(v, result);
        }
    });
    function sumByKey(obj, result) {
        _.forEach(obj, function (v, k) {
            result[k] = result[k] || 0; 
            result[k] += (+v || 0); 
        });
    }
    //{ s: 20, f: 5 }
    return result;
}
function avgByState(data, index, numerator, highGroupExp) {

    var info = {
        data: {avg: 0},
        count: 0
    };
    if (!data || !data[index]) return info;
    //根据正则得到total
    var totalObj = getTotalByGroupOfExp(data, highGroupExp);
    var totalNum = sumObj(totalObj);
    //console.log(JSON.stringify(totalObj));
    var avg = point((data[index][numerator] || 0) / totalNum); 
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

