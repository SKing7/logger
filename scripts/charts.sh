#!/bin/bash

/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/index/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/search/view/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/search/mapview/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/detail/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/navigation/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page -n '/navigation/buslist/'

/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/index/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/search/view/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/search/mapview/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/detail/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/navigation/index/'
/usr/local/bin/node /home/logger/analyzer/tasks/pagespeed.js -o page_30d -n '/navigation/buslist/'
