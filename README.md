# AWS Three Tier Web Architecture Workshop
## For more projects, check out  
## [https://harishnshetty.github.io/projects.html](https://harishnshetty.github.io/projects.html)
## [youtube-Link](https://www.youtube.com/@devopsHarishNShetty)
## Architecture Overview
![Architecture Diagram](https://github.com/harishnshetty/image-data-project/blob/c699b36dbe836af410a57079adb2e161267e78fc/3tieraws-project-15services.jpg)


---
```
1. VPC (12 Subnets, 10 Route Tables, 1 IGW, 3 NAT)
2. Security Group (Cross-connection)
3. EC2
4. Auto Scaling Group (ASG with IAM & Launch Template)
5. ALB (2 Target Groups)
6. IAM (for Image Build & Access Control)
7. RDS (MySQL)
8. Secrets Manager
9. S3 (Data + VPC Flow Logs)
10. Cloud Watch
11. SNS
12. Cloud Trail
13. Cloud Front
14. ACM (SSL Certificates)
15. WAF 
16. Route 53
```

---

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
| 1. External-alb     | 80, 443        | 0.0.0.0/24    | all access from internet                     |
| 2. Web-srv      | 80, 443, 22    | Web-ALB       | only front-alb and jump server access        |
|              |                | jump-server   |                                              |
| 3. Internal-app-alb     |  80, 443  | 2. Web-srv      | only web-srv                                 |
| 4. app-Srv      | 4000,  22 | 3. Internal-app-alb | only 3. Internal-app-alb and jump server access          |
|              |                | jump-server   |                                              |
| 5. DB-srv       | 3306, 22       | 4. app-Srv       | only app-srv and jump server access          |
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

| #   | Component         | Name/Route Table                | CIDR/Details      | NAT Gateway | Notes                                         |
|-----|-------------------|---------------------------------|-------------------|-------------|-----------------------------------------------|
| 1   | Internet Gateway  | 3-tier-igw                      |                   |             |                                               |
| 3   | Nat gateway       | 3-tier-1a                       |                   |             |                                               |
|     |                   | 3-tier-1b                       |                   |             |                                               |
|     |                   | 3-tier-1c                       |                   |             |                                               |
| 10  | Route-Table       | 3-tier-Public-rt                |                   |             |                                               |
|     |                   | 3-tier-web-Private-rt-1a        | 10.75.4.0/24      | nat-1a      |                                               |
|     |                   | 3-tier-web-Private-rt-1b        | 10.75.5.0/24      | nat-1b      |                                               |
|     |                   | 3-tier-web-Private-rt-1c        | 10.75.6.0/24      | nat-1c      |                                               |
|     |                   | 3-tier-app-Private-rt-1a        | 10.75.7.0/24      | nat-1a      |                                               |
|     |                   | 3-tier-app-Private-rt-1b        | 10.75.8.0/24      | nat-1b      |                                               |
|     |                   | 3-tier-app-Private-rt-1c        | 10.75.9.0/24      | nat-1c      |                                               |
|     |                   | 3-tier-db-Private-rt-1a         | 10.75.10.0/24     | nat-1a      |                                               |
|     |                   | 3-tier-db-Private-rt-1b         | 10.75.11.0/24     | nat-1b      |                                               |
|     |                   | 3-tier-db-Private-rt-1c         | 10.75.12.0/24     | nat-1c      |                                               |
 


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

| Parameter                          | Value                |
|-------------------------------------|----------------------|
| DB instance identifier              | db-3tier             |
| Master username                     | admin                |
| Self managed password               | SuperadminPassword   |
| Instance class (Burstable)          | db.t3.small          |
| Storage                            | 20 GB                |
| Virtual private cloud VPC           | 3-tier-vpc           |
| Security Group (SG)                 | db-srv               |
| Enable Enhanced monitoring          | Unchecked            |
---

### Move on to the Secret manager

Other type of secret:

```
DB_HOST = your rds Endpoint
DB_USER = admin
DB_PWD =  SuperadminPassword
DB_DATABASE = webappdb
```
- Secret name: rds-mysql-secret

---

## Now add the Database into the RDS-MYSQL

**Ref:** https://catalog.us-east-1.prod.workshops.aws/workshops/85cd2bb2-7f79-4e96-bdee-8078e469752a/en-US/part3/configuredatabase

```bash
mysql -h CHANGE-TO-YOUR-RDS-ENDPOINT -u admin -p
```

```sql
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

- 3-tier-app-role:
    - AmazonS3ReadOnlyAccess
    - AmazonSSMManagedInstanceCore
    - SecretsManagerReadWrite

---

## Create web launch template

| Parameter              | Value                |
|------------------------|----------------------|
| Name                   | web-tier-lt          |
| My AMI's               | Web-Tier-IAM-IMAGE   |
| Security Groups        | Web-Srv              |
| IAM Instance Profile   | 3-tier-web-role      |

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

| Parameter              | Value                |
|------------------------|----------------------|
| Name                   | app-tier-lt          |
| My AMI's               | app-Tier-IAM-IMAGE   |
| Security Groups        | app-Srv              |
| IAM Instance Profile   | 3-tier-web-role      |

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

| Tier      | Name      | Port  | VPC         | Health-check   |
|-----------|-----------|-------|-------------|---------------|
| Web Tier  | Web-tier  | 80    | 3-tier-vpc  |               |
| App Tier  | App-tier  | 4000  | 3-tier-vpc  | /health        |
---

## Create Load balancers

### Application Load Balancers
| Load Balancer | Name     | Type            | VPC        | Availability Zones                                 | Security Groups | Listeners & Routing   |
|---------------|----------|-----------------|------------|---------------------------------------------------|-----------------|----------------------|
| app-alb       | app-alb  | Internal-facing | 3-tier-vpc | App-Private-Subnet-1a, 1b, 1c                     | app-ALB         | 80 app-tier          |
| web-alb       | web-alb  | Internet-facing | 3-tier-vpc | Public-Subnet-1a, 1b, 1                           | Web-ALB         | 80 web-tier          |
---

## Immediately update the `nginx.config` of your internal load balancer Address
---
## Create Auto Scaling

| Name            | Launch template | Instance types | VPC        | Subnets (AZs)                       | Load balancer | Desired | min | max | Scaling policy | Notifications    | Tag      |
|-----------------|----------------|---------------|------------|--------------------------------------|---------------|---------|-----|-----|---------------|-----------------|----------|
| web-tier-asg    | web-tier-lb    | t2.micro      | 3-tier-vpc | Web-Private-Subnet-1a, 1b, 1c        | web-tier      | 3       | 3   | 6   | 60            | web-tier-sns    | web-asg  |
| app-tier-asg    | app-tier-lb    | t2.micro      | 3-tier-vpc | app-Private-Subnet-1a, 1b, 1c        | app-tier      | 3       | 3   | 6   | 60            | app-tier-sns    | app-asg  |

---

## Create the Cloudwatch 
- all alarms --> ec2 --> ASG --> Cpuutlization

---

## Create the Cloudfront  
## Create the ACM for the Cloudfront  
## Configure the WAF  
## Configure the Route53  
