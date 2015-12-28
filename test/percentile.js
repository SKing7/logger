var percentile = require('../lib/percentile');

var percent = 75;
var testData = [ '1328', '866', '1199', '1146', '1788', '2032', '1438', '1783', '3579', '1162', '1652', '1058', '259', '1688', '1636', '592',
  '1310', '957', '613', '1046', '547', '211', '1539', '1118', '832', '579', '3588', '1237', '598', '1512', '5496', '1376', '5045', '2913',
  '1687', '1711', '1556', '784', '2528', '482', '1049', '947' ]


var rt = percentile.calc(testData, percent);
testData.sort(function (a, b) {
    return a - b;
});
var expectedPos = testData.length * 0.75;
console.log(rt, testData[Math.floor(expectedPos)]);
console.log(testData);
