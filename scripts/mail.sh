#!/bin/bash
cd /home/logger/analyzer
NODE_ENV=production /usr/local/bin/node tasks/dailyreport.js
/usr/local/bin/node tasks/pagespeed.js -o page -n '/index/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/search/view/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/search/mapview/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/detail/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/navigation/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/navigation/buslist/'
