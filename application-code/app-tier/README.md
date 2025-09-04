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
# Log everything to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Install AWS CLI v2 (if not already)
yum install -y awscli

# Download application code from S3
aws s3 cp s3://<YOUR-S3-BUCKET-NAME>/application-code /home/ec2-user/application-code --recursive

# Go to app directory
cd /home/ec2-user/application-code

# Make script executable and run it
chmod +x app.sh
sudo ./app.sh

```
curl http://localhost:4000/health #(To do the health check)