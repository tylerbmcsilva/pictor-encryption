#!/bin/bash
sudo yum update -y
sudo yum install nginx -y
sudo service nginx start

cd /tmp/

echo -e "Installing NVM"
sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
sudo yum install -y nodejs
sudo yum install -y gcc-c++ make

curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn -y

echo -e "Restarting Bash"
source ~/.bashrc

echo -e "Installing PM2"
sudo npm install -g pm2
echo -e "Installing Application Dependencies"
sudo yarn install
