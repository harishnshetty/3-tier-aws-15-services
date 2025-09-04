# AWS Three Tier Web Architecture Workshop

## Setup the Ec2-instance and create the IAM (WEB Tier)
**REF:** [web-tier](https://github.com/harishnshetty/3-tier-aws-15-services/edit/main/application-code/web-tier)

**Only Setup the Packages:**  
- mginx  
- nvm  

---

## Setup the Ec2-instance and create the IAM (APP Tier)
**REF:** [app-tier](https://github.com/harishnshetty/3-tier-aws-15-services/tree/main/application-code/app-tier)

**Only Setup the Packages:**  
- install  
    - mysql client  
    - nvm  
    - pm2  

---

## Create images for both web and app Tier
- Web-Tier-IAM-IMAGE  
- APP-Tier-IAM-IMAGE  

---

## Create a Security Group

| SG name      | inbound        | Access         | Description                                  |
|--------------|----------------|---------------|----------------------------------------------|
| Jump Server  | 22             | MY-ip         | access from my laptop                        |
| Web-ALB      | 80, 443        | 0.0.0.0/24    | all access from internet                     |
| Web-srv      | 80, 443, 22    | Web-ALB       | only front-alb and jump server access        |
|              |                | jump-server   |                                              |
| app-alb      | 4000, 80, 443  | web-srv       | only web-srv                                 |
| app-Srv      | 4000, 80, 443, 22 | app-alb  | only app-alb and jump server access          |
|              |                | jump-server   |                                              |
| DB-srv       | 3306, 22       | app-srv       | only app-srv and jump server access          |
|              |                | jump-server   |                                              |

---

## Create a VPC

| #  | Component         | Name                  | CIDR / Details                                |
|----|-------------------|-----------------------|-----------------------------------------------|
| 1  | VPC              | 3-tier-vpc            | 10.75.0.0/16                                  |
| 12 | Subnets          | Public-Subnet-1a      | 10.75.1.0/24                                  |
|    |                  | Public-Subnet-1b      | 10.75.2.0/24                                  |
|    |                  | Public-Subnet-1c      | 10.75.3.0/24                                  |
|    |                  | Web-Private-Subnet-1a | 10.75.4.0/24                                  |
|    |                  | Web-Private-Subnet-1b | 10.75.5.0/24                                  |
|    |                  | Web-Private-Subnet-1c | 10.75.6.0/24                                  |
|    |                  | App-Private-Subnet-1a | 10.75.7.0/24                                  |
|    |                  | App-Private-Subnet-1b | 10.75.8.0/24                                  |
|    |                  | App-Private-Subnet-1c | 10.75.9.0/24                                  |
|    |                  | DB-Private-Subnet-1a  | 10.75.10.0/24                                 |
|    |                  | DB-Private-Subnet-1b  | 10.75.11.0/24                                 |
|    |                  | DB-Private-Subnet-1c  | 10.75.12.0/24                                 |

| #  | Internet Gateway | 3-tier-igw            |                                               |
| 3  | Nat gateway     | 3-tier-1a             |                                                |
|    |                 | 3-tier-1b             |                                                |
|    |                 | 3-tier-1c             |                                                |
| 10 | Route-Table     | 3-tier-Public-rt      | --> attach all subnets in the single public route table |

|    |                 | 3-tier-web-Private-rt-1a | 10.75.4.0/24 | nat-1a |
|    |                 | 3-tier-web-Private-rt-1b | 10.75.5.0/24 | nat-1b |
|    |                 | 3-tier-web-Private-rt-1c | 10.75.6.0/24 | nat-1c |

|    |                 | 3-tier-app-Private-rt-1a | 10.75.7.0/24 | nat-1a |
|    |                 | 3-tier-app-Private-rt-1b | 10.75.8.0/24 | nat-1b |
|    |                 | 3-tier-app-Private-rt-1c | 10.75.9.0/24 | nat-1c |

|    |                 | 3-tier-db-Private-rt-1a  | 10.75.10.0/24 | nat-1a |
|    |                 | 3-tier-db-Private-rt-1b  | 10.75.11.0/24 | nat-1b |
|    |                 | 3-tier-db-Private-rt-1c  | 10.75.12.0/24 | nat-1c |

---

## Create a Cloud-Trail
- Name: my-aws-Account-Activity

---

## Create the 2 S3 Buckets

```bash
git clone https://github.com/harishnshetty/3-tier-aws-15-services.git
```

1. 3-tier-aws-project-8745 (upload your content)  
2. 3tier-vpc-flow-log-8745 (attach this bucket this immediately) with arn Value [ arn:aws:s3:::3tier-vpc-flow-log-8745 ]

---

## Create a Mysql in the RDS

### First Create the subnet Group

| Name    | three-subnet-gp-rds   |
|---------|-----------------------|
| VPC     | 3-tier-vpc            |
| AZ      | 1a, b, c              |
| Subnets | DB-Private-Subnet-1a  |
|         | DB-Private-Subnet-1b  |
|         | DB-Private-Subnet-1c  |

- DB instance identifier: db-3tier  
- Master username: admin  
- Self managed: SuperadminPassword  
- Burstable classes (includes t classes): db.t3.small  
- Storage: 20 GB  
- Virtual private cloud VPC: 3-tier-vpc  
- SG: db-srv  
- Uncheck [ Enable Enhanced monitoring ]

---

### Move on to the Secret manager

Other type of secret:

```
DB_HOST = your rds Endpoint
DB_USER = admin
DB_PWD =  SuperadminPassword
DB_DATABASE = db-3tier
```
- Secret name: rds-mysql-secret

---

## Now add the Database into the RDS-MYSQL

**Ref:** https://catalog.us-east-1.prod.workshops.aws/workshops/85cd2bb2-7f79-4e96-bdee-8078e469752a/en-US/part3/configuredatabase

```sql
mysql -h CHANGE-TO-YOUR-RDS-ENDPOINT -u admin -p
CREATE DATABASE webappdb;
SHOW DATABASES;
USE webappdb;
CREATE TABLE IF NOT EXISTS transactions(id INT NOT NULL AUTO_INCREMENT, amount DECIMAL(10,2), description VARCHAR(100), PRIMARY KEY(id));
SHOW TABLES;
INSERT INTO transactions (amount,description) VALUES ('400','groceries');
SELECT * FROM transactions;
```

---

## Create SNS

- name: web-tier-sns  
- name: app-tier-sns  
- name: Cloudwatch-sns  

---

## Create a role for both web and app tier

- 3-tier-web-role:
    - AmazonS3ReadOnlyAccess
    - AmazonSSMManagedInstanceCore

- 3-tier-db-role:
    - AmazonS3ReadOnlyAccess
    - AmazonSSMManagedInstanceCore
    - SecretsManagerReadWrite

---

## Create web launch template

- Name: web-tier-lt
- My Ami's: Web-Tier-IAM-IMAGE
- Security groups: Web-Srv
- IAM instance profile: 3-tier-web-role

**User Data:**
```bash
#!/bin/bash
# Log everything to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Install AWS CLI v2 (if not already)
yum install -y awscli

# Download application code from S3
aws s3 cp s3://three-tier-8745/application-code /home/ec2-user/application-code --recursive

# Go to app directory
cd /home/ec2-user/application-code

# Make script executable and run it
chmod +x web.sh
sudo ./web.sh
```

---

## Create app launch template

- Name: app-tier-lt
- My Ami's: app-Tier-IAM-IMAGE
- Security groups: app-Srv
- IAM instance profile: 3-tier-web-role

**User Data:**
```bash
#!/bin/bash
# Log everything to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Install AWS CLI v2 (if not already)
yum install -y awscli

# Download application code from S3
aws s3 cp s3://three-tier-8745/application-code /home/ec2-user/application-code --recursive

# Go to app directory
cd /home/ec2-user/application-code

# Make script executable and run it
chmod +x app.sh
sudo ./app.sh
```

---

## Create target group 

### [ web tier ]
- Name: Web-tier  
- Port: 80  
- VPC: 3-tier-vpc  

### [ app tier ]
- Name: App-tier  
- Port: 4000  
- VPC: 3-tier-vpc  
- Health-check: /health  

---

## Create Load balancers

### Application Load Balancers

#### app-alb
- name: app-alb  
- type: Internal-facing  
- VPC: 3-tier-vpc  
- AZ: App-Private-Subnet-1a, App-Private-Subnet-1b, App-Private-Subnet-1c  
- Security groups: app-ALB  
- Listeners and routing: 80 app-tier  

#### web-alb
- name: web-alb  
- type: Internet-facing  
- VPC: 3-tier-vpc  
- AZ: Public-Subnet-1a, Public-Subnet-1b, Public-Subnet-1  
- Security groups: Web-ALB  
- Listeners and routing: 80 web-tier  

---

## Create Auto Scaling

| Name            | Launch template | Instance types | VPC        | Subnets (AZs)                       | Load balancer | Desired | min | max | Scaling policy | Notifications    | Tag      |
|-----------------|----------------|---------------|------------|--------------------------------------|---------------|---------|-----|-----|---------------|-----------------|----------|
| web-tier-asg    | web-tier-lb    | t2.micro      | 3-tier-vpc | Web-Private-Subnet-1a, 1b, 1c        | web-tier      | 3       | 3   | 6   | 60            | web-tier-sns    | web-asg  |
| app-tier-asg    | app-tier-lb    | t2.micro      | 3-tier-vpc | app-Private-Subnet-1a, 1b, 1c        | app-tier      | 3       | 3   | 6   | 60            | web-tier-sns    | web-asg  |

---

## Create the Cloudwatch 
- all alarms --> ec2 --> ASG --> Cpuutlization

---

## Create the Cloudfront  
## Create the ACM for the Cloudfront  
## Configure the WAF  
## Configure the Route53  
