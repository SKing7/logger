### timing analyzer for mobile autonavi



```shell
0  0  *  *  * /bin/sh /opt/logrotate/logrotate.sh
0  3  *  *  * /bin/sh /home/logger/analyzer/scripts/db.sh
0  4  *  *  * /bin/sh /home/logger/analyzer/scripts/charts.sh
0  5  *  *  * /bin/sh /home/logger/analyzer/scripts/timingshot.sh
0  9  *  *  * /bin/sh /home/logger/analyzer/scripts/mail.sh
```
