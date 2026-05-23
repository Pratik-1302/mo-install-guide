Amazon Linux 2 is yum-based and based on a fork of RHEL 7. It is older than the other Tier 1 distros and has end-of-support scheduled for June 2026; new deployments should prefer AL2023 or RHEL 8/9.

### 1.1 Update the system

```bash
sudo yum update -y
sudo reboot
```

### 1.2 Install EPEL via amazon-linux-extras

```bash
sudo amazon-linux-extras install -y epel
sudo yum update -y
```

### 1.3 Install required utilities

```bash
sudo yum install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet
```

### 1.4 Firewall: use Security Groups

Same approach as AL2023: manage inbound at the EC2 Security Group level. Open ports 8080, 8070, 8071, 8072, 6379, 5672, 15672 in the IDP instance's SG.

### 1.5 SELinux

AL2 ships SELinux in permissive mode by default.

```bash
getenforce
```
