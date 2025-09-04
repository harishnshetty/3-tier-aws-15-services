# AWS Three Tier Web Architecture Workshop


## Setup the  Ec2-instance and create the IAM (WEB Tier)
## REF (https://github.com/harishnshetty/3-tier-aws-15-services/edit/main/application-code/web-tier)

## only Setup the Packages
mginx
nvm



## Setup the  Ec2-instance and create the IAM (APP) Tier)
## REF (https://github.com/harishnshetty/3-tier-aws-15-services/tree/main/application-code/app-tier)

## only Setup the Packages
## install 
mysql client
nvm


# NOW Create image both web and app Tier
Web-Tier-IAM-IMAGE
APP-Tier-IAM-IMAGE


# Create a Security Group
 SG name        |   inbound | Access | Description

1. Jump Server  |   22      | MY-ip | access from my laptop

2. Web-ALB      | 80 , 443  | 0.0.0.0/24 | all access from internet

3. Web-srv      | 80 ,443 , 22 | Web-ALB | only front-alb and jump server access
                                jump-server
4. app-alb  | 4000, 80 ,443  | web-srv | only web-srv 
                                                               

5. app-Srv      | 4000 , 80 ,443 , 22 | app-alb | only app-alb and jump server access
                                jump-server                             

6. DB-srv      | 3306 ,22 | app-srv | only app-srv and jump server access
                                jump-server                         

# Create a VPC 

1  | VPC      | 3-tier-vpc | 10.75.0.0/16
12 | Subnets    | Public-Subnet-1a | Public-Subnet-1b | Public-Subnet-1c |
                | 10.75.1.0/24 |   10.75.2.0/24   | 10.75.3.0/24 |

                | Web-Private-Subnet-1a | Web-Private-Subnet-1b | Web-Private-Subnet-1c |
                | 10.75.4.0/24 |   10.75.5.0/24   | 10.75.6.0/24 |


                | App-Private-Subnet-1a | App-Private-Subnet-1b | App-Private-Subnet-1c |
                | 10.75.7.0/24 |   10.75.8.0/24   | 10.75.9.0/24 |


                | DB-Private-Subnet-1a | DB-Private-Subnet-1b | DB-Private-Subnet-1c |
                | 10.75.10.0/24 |   10.75.11.0/24   | 10.75.12.0/24 |




1  |Internet Gateway | 3-tier-igw
3 | Nat gateway      | 3-tier-1a | 3-tier-1b | 3-tier-1c
10 | Route-Table     | 3-tier-Public-rt | --> attach all subnets in the single public route table

                    | 3-tier-web-Private-rt-1a | 3-tier-web-Private-rt-1b | 3-tier-web-Private-rt-1c |
                    | 10.75.4.0/24 |   10.75.5.0/24   | 10.75.6.0/24 |
                    | nat-1a        | nat-1b   | nat-1c   


                    | 3-tier-app-Private-rt-1a | 3-tier-app-Private-rt-1b | 3-tier-app-Private-rt-1c |
                    | 10.75.7.0/24 |   10.75.8.0/24   | 10.75.9.0/24 |
                    | nat-1a        | nat-1b   | nat-1c   


                    | 3-tier-db-Private-rt-1a | 3-tier-db-Private-rt-1b | 3-tier-db-Private-rt-1c |
                    | 10.75.10.0/24 |   10.75.11.0/24   | 10.75.12.0/24 |
                    | nat-1a        | nat-1b   | nat-1c   



# Create the 2 S3 Buckets
git clone https://github.com/harishnshetty/3-tier-aws-15-services.git
1. 3-tier-aws-project-8745 (upload your content)
2. 3tier-vpc-flow-log-8745 (attach this bucket this immedaitly)  with arn Value [ arn:aws:s3:::3tier-vpc-flow-log-8745 ]


# Create a Mysql in the RDS

## first Create the subnet Group
Subnet groups 
Name        | three-subnet-gp-rds
VPC         | 3-tier-vpc
AZ          | 1a,b,c
subnets     | DB-Private-Subnet-1a
            | DB-Private-Subnet-1b
            | DB-Private-Subnet-1c



DB instance identifier | db-3tier

Master username         | admin 
Self managed            | SuperadminPassword
Burstable classes (includes t classes) | db.t3.small
Storage         | 20 GB
Virtual private cloud VPC | 3-tier-vpc
SG - db-srv
Uncheck [ Enable Enhanced monitoring ]


## move on to the Secret manager
Other type of secret


 DB_HOST = your rds Endpoint
 DB_USER = admin
 DB_PWD =  SuperadminPassword
 DB_DATABASE = db-3tier


 Secret name  = rds-mysql-secret

## create SNS

name | web-tier-sns

name | app-tier-sns

 # Create a role for both web and app tier

3-tier-web-role
 AmazonS3ReadOnlyAccess
 AmazonSSMManagedInstanceCore

3-tier-db-role
 AmazonS3ReadOnlyAccess
 AmazonSSMManagedInstanceCore
 SecretsManagerReadWrite

 # Create web launch template

Name | web-tier-lt

 My Ami's  | Web-Tier-IAM-IMAGE

Security groups | Web-Srv
IAM instance profile | 3-tier-web-role

User  Data 

```bash
#!/bin/bash
sudo aws s3 cp s3://3-tier-aws-project-8745/application-code/web-tier web-tier --recursive
sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user



cd /home/ec2-user/web-tier
npm install

cd /home/ec2-user/web-tier
npm run build

cd /etc/nginx
sudo mv nginx.conf nginx-backup.conf

sudo aws s3 cp s3://3-tier-aws-project-8745/application-code/nginx.conf . 
sudo chmod -R 755 /home/ec2-user
sudo systemctl restart nginx.service
sudo chkconfig nginx on
```

 # Create web launch template

Name | app-tier-lt

 My Ami's  | app-Tier-IAM-IMAGE

Security groups | app-Srv
IAM instance profile | 3-tier-web-role

User  Data 

```bash

#!/bin/bash
cd /home/ec2-user
sudo aws s3 cp s3://3-tier-aws-project-8745/application-code/app-tier app-tier --recursive
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
EOF
```


# Create target group 
## [ web tier ]
Name | Web-tier
Port | 80
VPC  | 3-tier-vpc

## [ app tier ]

Name | App-tier
Port | 4000
VPC  | 3-tier-vpc
Health-check | /health

# Create Load balancers 

Application Load Balancers


## app-alb
name | app-alb
type | Internal-facing
VPC  | 3-tier-vpc

AZ  | App-Private-Subnet-1a | App-Private-Subnet-1b | App-Private-Subnet-1c |

Security groups | app-ALB
Listeners and routing | 80 app-tier



## web-alb
name | web-alb
type | Internet-facing
VPC  | 3-tier-vpc

AZ | Public-Subnet-1a | Public-Subnet-1b | Public-Subnet-1

Security groups | Web-ALB
Listeners and routing | 80 web-tier


# Create Auto Scaling

Name | web-tier-asg
Launch template | web-tier-lb
Manually add instance types | t2.micro

VPC  | 3-tier-vpc

Availability Zones and subnets  |  Web-Private-Subnet-1a | Web-Private-Subnet-1b | Web-Private-Subnet-1c |

Attach to an existing load balancer | web-tier 

Desired 3 
min 3
max 6

Target tracking scaling policy | 60
Add notifications | web-tier-sns
Tag | web-asg



Name | app-tier-asg
Launch template | app-tier-lb
Manually add instance types | t2.micro

VPC  | 3-tier-vpc

Availability Zones and subnets  |  app-Private-Subnet-1a | app-Private-Subnet-1b | app-Private-Subnet-1c |

Attach to an existing load balancer | app-tier 

Desired 3 
min 3
max 6

Target tracking scaling policy | 60
Add notifications | web-tier-sns
Tag | web-asg





db-3tier.cne0wymoyx30.ap-south-1.rds.amazonaws.com