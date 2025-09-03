# INSTALLING nginx
```bash
#!/bin/bash
sudo -su ec2-user
cd /home/ec2-user
```
```bash
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```
# INSTALLING Aws-Cli
# (REF: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```
# INSTALLING NODEJS 
# (REF: https://nodejs.org/en/download/)	
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.19.0".
nvm current # Should print "v22.19.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```




## !!! IMP  --USER DATA SCRIPT !!!
## MODIFY BELOW CODE WITH YOUR S3 BUCKET NAME

```bash
#!/bin/bash
sudo aws s3 cp s3://<YOUR-S3-BUCKET-NAME>/application-code/web-tier web-tier --recursive
sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user



cd /home/ec2-user/web-tier
npm install
#npm audit fix
cd /home/ec2-user/web-tier
npm run build

cd /etc/nginx
sudo mv nginx.conf nginx-backup.conf

sudo aws s3 cp s3://<YOUR-S3-BUCKET-NAME>/application-code/nginx.conf . 
sudo chmod -R 755 /home/ec2-user
sudo service nginx restart
sudo chkconfig nginx on
```


# Replace the Internal-alb-address in the nginx