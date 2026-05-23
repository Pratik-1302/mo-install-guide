Amazon Linux 2023 is dnf-based and close to RHEL 9. The main differences come from the AWS-tuned defaults: no `firewalld` by default (relying on EC2 security groups), no `subscription-manager`, and pre-applied kernel parameters for cloud workloads.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Install required utilities

EPEL is not enabled by default on AL2023 and is not necessary: most utilities the installer needs are in the standard Amazon Linux repos.

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet
```

### 1.3 Firewall: use Security Groups, not firewalld

AWS recommends managing inbound traffic at the **EC2 Security Group** level rather than on the host. In your VPC console, open the following inbound ports on the IDP instance's security group:

| Port  | Source                | Purpose                |
|-------|-----------------------|------------------------|
| 8080  | Your office / VPN CIDR| miniOrange UI          |
| 8070  | localhost only        | Eureka (internal)      |
| 8071  | localhost only        | Configserver (internal)|
| 8072  | localhost only        | Gatekeeper (internal)  |
| 6379  | localhost only        | Redis (bundled)        |
| 5672  | localhost only        | RabbitMQ AMQP          |
| 15672 | Your office CIDR      | RabbitMQ mgmt UI       |

If you prefer host-level firewalling on top of Security Groups, you can install firewalld:

```bash
sudo dnf install -y firewalld
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-port={8080,8070,8071,8072,6379,5672,15672}/tcp
sudo firewall-cmd --reload
```

### 1.4 SELinux

AL2023 ships SELinux but defaults to **permissive** mode, so no change is needed.

```bash
getenforce
```

Expected output: `Permissive`.
