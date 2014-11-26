#!/bin/bash
cd /home/logger/analyzer
/usr/local/bin/node tasks/dailyreport.js
node tasks/pagespeed.js -o page -n '/index/index/'
node tasks/pagespeed.js -o page -n '/search/view/'
node tasks/pagespeed.js -o page -n '/search/mapview/'
node tasks/pagespeed.js -o page -n '/detail/index/'
node tasks/pagespeed.js -o page -n '/navigation/index/'
node tasks/pagespeed.js -o page -n '/navigation/buslist/'
