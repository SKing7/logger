#!/bin/bash
#
logs_dir=/opt/webserver/logs
tmp_dir="$logs_dir/tmp/"
prefix=access_
y=`date +%Y`
if [ ! $1 ]; then  
  #上个月
  m=`date +%m`
  m=$[m-1]
else
  m=$1
fi
#
#先将日志文件移动到备份目录
len=${#m};
if [ $len -lt 2 ]
then
  m="0""$m"
fi
cd $logs_dir
echo "拷贝$prefix$y$m*.log文件到tmp目录";
find . -name "$prefix$y$m*.log" | xargs -I '{}' mv {} $tmp_dir 
echo "打包：$prefix$y$m*.log";
#
#打包log文件，并以日期命名
cd $tmp_dir
echo 打包开始：`date`
tar czf $prefix$y$m.tgz *.log
echo 打包结束：`date`
#
#删除备份目录的临时文件
rm -f *.log
#
#移动打包后的日志文件
cd $logs_dir
mkdir -p "backup/$y"
mv "$tmp_dir/$prefix$y$m.tgz" "backup/$y"

