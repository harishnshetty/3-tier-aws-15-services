#!/bin/bash
sudo aws s3 cp s3://3-tier-aws-project-8745/application-code/web-tier web-tier --recursive
sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user



cd /home/ec2-user/web-tier
npm install
#npm audit fix
cd /home/ec2-user/web-tier
npm run build

cd /etc/nginx
sudo mv nginx.conf nginx-backup.conf

sudo aws s3 cp s3://3-tier-aws-project-8745/application-code/nginx.conf . 
sudo chmod -R 755 /home/ec2-user
sudo service nginx restart
sudo chkconfig nginx on