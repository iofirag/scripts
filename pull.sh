#!/bin/bash
if [ $USER != "pm2" ]; then
   echo "This script must be run as pm2" 
   exit 1
fi

cd /snc/snc
git reset --hard HEAD
git pull
npm i
pm2 del all
pm2 start pm2.config.js --env staging
pm2 save
