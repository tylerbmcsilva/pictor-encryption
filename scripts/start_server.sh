#!/bin/bash
cd /tmp/

isExistApp = `pgrep httpd`
if [[ -n  $isExistApp ]]; then
    service httpd stop
fi

yum remove -y httpd

dbhost=$(aws ssm get-parameters --region us-east-1 --names pictor-dbhost --with-decryption --query Parameters[0].Value)
dbname=$(aws ssm get-parameters --region us-east-1 --names pictor-dbname --with-decryption --query Parameters[0].Value)
dbpassword=$(aws ssm get-parameters --region us-east-1 --names pictor-dbpassword --with-decryption --query Parameters[0].Value)


pm2 delete all
pm2 start index.js DBHOST=$dbhost DBNAME=$dbname DBPASSWORD=$dbpassword
