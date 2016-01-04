#!/bin/bash

cd /opt/timing/logger
NODE_ENV=production /usr/local/bin/node tasks/dailyreport.js
