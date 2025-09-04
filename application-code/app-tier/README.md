# App-tier Setup 
## youtube (https://www.youtube.com/@devopsHarishNShetty)
# For more Projects. https://harishnshetty.github.io/projects.html
## INSTALLING MYSQL IN AMAZON LINUX 2023
## (REF: https://dev.to/aws-builders/installing-mysql-on-amazon-linux-2023-1512)

```bash
#!/bin/bash
sudo su - ec2-user
sudo wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo dnf install mysql80-community-release-el9-1.noarch.rpm -y
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
sudo dnf install mysql-community-client -y
mysql --version
```

## TO TEST CONNECTION BETWEEN APP-SERVER & DATABASE SERVER
```bash
mysql -h <RDS-Endpoint> -u <username> -p <Hit Enter & provide your password>
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
npm install -g pm2

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
cd /home/ec2-user
sudo aws s3 cp s3://<YOUR-S3-BUCKET-NAME>/application-code/app-tier app-tier --recursive
cd app-tier
sudo chown -R ec2-user:ec2-user /home/ec2-user/app-tier
sudo chmod -R 755 /home/ec2-user/app-tier

npm install @aws-sdk/client-secrets-manager mysql2

npm install
npm audit fix

pm2 start index.js 	#(Start Application with PM2, PM2 is process manager for NodeJS)

pm2 startup 			  #(Set PM2 to Start on Boot)
# Generate systemd startup script for ec2-user (nvm-managed Node.js)
sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v*/bin \
    /home/ec2-user/.nvm/versions/node/v*/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Save the current PM2 process list
pm2 save

```
curl http://localhost:4000/health #(To do the health check)