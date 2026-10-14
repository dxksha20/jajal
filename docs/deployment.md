# Production AWS Deployment Architecture (docs/deployment.md)

**Application:** Jajal Medical Case Management System  
**Framework:** Laravel 12 (PHP 8.2+) with MySQL 8.0  

---

## 1. Cloud Architecture Overview

To ensure high availability, HIPAA-aligned data privacy, and secure operation, the Jajal Medical application is hosted on AWS using a decoupled, multi-tier infrastructure:

```
[ Internet Users / Hospital Clients ]
                 |
            (HTTPS :443)
                 v
   [ AWS Route 53 DNS + CloudFront CDN ]
                 |
                 v
   [ Application Load Balancer (ALB) ]
        (SSL Termination via ACM)
                 |
      +----------+----------+
      | (Private Subnet)    |
      v                     v
[ EC2: App Instance A ] [ EC2: App Instance B ]
  (Ubuntu + Nginx + PHP 8.2-FPM + Opcache)
      |                     |
      +----------+----------+
                 |
       (Port 3306 - Private VPC)
                 v
     [ Amazon RDS for MySQL 8.0 ]
   (Multi-AZ Automated Failover)
                 |
     [ Amazon S3 ] (Encrypted Backups & Document Storage)
```

---

## 2. Infrastructure Components

### 1. Compute: AWS EC2 (Application Servers)
- **Base OS:** Ubuntu 24.04 LTS running **PHP 8.2-FPM** and **Nginx**.
- **Process Manager:** `supervisord` manages queue workers (`php artisan queue:work`) and scheduled cron jobs (`php artisan schedule:run`).
- **Autoscaling:** An Auto Scaling Group (ASG) maintains a minimum of 2 instances across separate Availability Zones (AZs) for fault tolerance.

### 2. Database: Amazon RDS for MySQL 8.0
- **Engine:** MySQL 8.0 with InnoDB storage engine.
- **High Availability:** Multi-AZ deployment provides synchronous data replication to a secondary standby instance in another zone.
- **Backups:** Automated daily snapshots with 30-day retention and point-in-time recovery (PITR).

### 3. File & Asset Storage: Amazon S3
- Static assets (CSS, JS) and encrypted audit backups are stored in an S3 bucket configured with **Server-Side Encryption (SSE-KMS)** and private ACLs.
- Public read access is completely blocked at the bucket level.

### 4. Network Security & VPC Security Groups
Strict least-privilege firewall rules are enforced across VPC subnets:
- **ALB Security Group:** Allows inbound HTTPS traffic on port 443 and HTTP on port 80 (redirects to 443) from `0.0.0.0/0`.
- **EC2 Security Group:** Allows inbound HTTP (port 80) **only** from the ALB Security Group. SSH (port 22) is restricted to an internal bastion host or AWS Systems Manager (SSM) Session Manager (no open public SSH ports).
- **RDS Security Group:** Allows inbound MySQL traffic on port 3306 **strictly** from the EC2 Security Group. The database is never assigned a public IP.

### 5. Secrets & Environment Configuration
- Sensitive configuration parameters (`DB_PASSWORD`, `APP_KEY`, Sanctum encryption keys) are stored in **AWS Systems Manager Parameter Store** (SecureString) or **AWS Secrets Manager**.
- The production `.env` is populated securely during CI/CD deployment pipelines (GitHub Actions / AWS CodeDeploy) and is never checked into Git.

### 6. SSL / TLS & HTTPS
- Free, auto-renewing SSL/TLS certificates are provisioned via **AWS Certificate Manager (ACM)** and mounted onto the Application Load Balancer.
- Strict Transport Security (HSTS) headers are enabled on Nginx to enforce TLS 1.3 across all client sessions.
