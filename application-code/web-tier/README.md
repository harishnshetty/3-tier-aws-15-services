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
sudo service nginx restart
sudo chkconfig nginx on
sudo yum install git -y
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
# Log everything to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Install AWS CLI v2 (if not already)
yum install -y awscli

# Download application code from S3
aws s3 cp s3://<YOUR-S3-BUCKET-NAME>/application-code /home/ec2-user/application-code --recursive

# Go to app directory
cd /home/ec2-user/application-code

# Make script executable and run it
chmod +x web.sh
sudo ./web.sh
```


# Replace the Internal-alb-address in the nginx

# Create the Cloudtrial
my-aws-account-activity

Select --> Event History