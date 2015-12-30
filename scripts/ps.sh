#!/bin/bash
#'/index/index/', '/search/view/', '/search/mapview/', '/detail/index/', '/navigation/index/', '/navigation/buslist/'
cd /opt/timing/logger
/usr/local/bin/node tasks/pagespeed.js -o page -n '/index/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/search/view/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/search/mapview/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/detail/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/navigation/index/'
/usr/local/bin/node tasks/pagespeed.js -o page -n '/navigation/buslist/'

/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/index/index/'
/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/search/view/'
/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/search/mapview/'
/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/detail/index/'
/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/navigation/index/'
/usr/local/bin/node tasks/pagespeed.js -o page_30d -n '/navigation/buslist/'
#
#pc
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page -n 'rt_mapfileLoad'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page -n 'rt_mapLoad'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page -n 'rt_mapshow'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page -n 'rt_markerKey'

SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page_30d -n 'rt_mapfileLoad'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page_30d -n 'rt_mapLoad'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page_30d -n 'rt_mapshow'
SITE=pc /usr/local/bin/node tasks/pagespeed.js -o page_30d -n 'rt_markerKey'

