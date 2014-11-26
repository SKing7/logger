#!/bin/bash
#'/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'
cd /home/logger/analyzer 
node tasks/pagespeed.js -o page -n '/index/index/'
node tasks/pagespeed.js -o page -n '/search/view/'
node tasks/pagespeed.js -o page -n '/search/mapview/'
node tasks/pagespeed.js -o page -n '/detail/index/'
node tasks/pagespeed.js -o page -n '/navigation/index/'
node tasks/pagespeed.js -o page -n '/navigation/buslist/'
