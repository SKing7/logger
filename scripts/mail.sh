#!/bin/bash

cd /home/logger/analyzer
NODE_ENV=production /usr/local/bin/node tasks/dailyreport.js
