#!/bin/bash
cd /tmp/

echo -e "Installing Node@10"
curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
echo -e "Installing C++"
yum install -y gcc-c++ make
echo -e "Installing NPM"
yum install -y nodejs npm
echo -e "Installing NGINX"
yum install -y nginx

echo -e "Installing PM2"
npm install -g pm2
echo -e "Installing Application Dependencies"
npm install
