#!/bin/bash
yum update -y

cd /tmp/

echo -e "Installing Node@10"
sudo curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
echo -e "Installing C++"
sudo yum install -y gcc-c++ make
echo -e "Installing NPM"
sudo yum install -y nodejs npm

echo -e "Installing PM2"
npm install -g pm2
echo -e "Installing Application Dependencies"
npm install
