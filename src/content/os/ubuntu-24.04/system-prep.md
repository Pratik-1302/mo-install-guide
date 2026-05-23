Before installing any service, update the package repositories and install the tools `mo-installer` and `moctl` depend on. Ubuntu uses `apt`, `ufw`, and `AppArmor` rather than the RHEL family's `dnf`, `firewalld`, and `SELinux`.

### 1.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### 1.2 Install required utilities

`jq` and most of these ship in the default Ubuntu repos, no EPEL equivalent needed.

```bash
sudo apt install -y \
  unzip wget curl jq net-tools vim bash-completion \
  ca-certificates gnupg lsb-release software-properties-common \
  lsof telnet
```

### 1.3 Configure the firewall

Ubuntu Server uses `ufw` by default. The DB port is opened in the database section.

```bash
sudo systemctl enable --now ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh

# IDP service ports
sudo ufw allow 8080/tcp comment 'miniorange'
sudo ufw allow 8070/tcp comment 'eurekaserver'
sudo ufw allow 8071/tcp comment 'configserver'
sudo ufw allow 8072/tcp comment 'gatekeeper'

# Redis (bundled with installer) and RabbitMQ
sudo ufw allow 6379/tcp comment 'redis'
sudo ufw allow 5672/tcp comment 'rabbitmq-amqp'
sudo ufw allow 15672/tcp comment 'rabbitmq-mgmt'

sudo ufw --force enable
sudo ufw status verbose
```

### 1.4 AppArmor

Ubuntu uses AppArmor instead of SELinux. AppArmor's default profiles do **not** interfere with the miniOrange microservices in the same way SELinux enforcing does, so no relaxation is required. Verify it is running but unobtrusive:

```bash
sudo aa-status | head -5
```

### 1.5 Set a hostname (optional)

```bash
sudo hostnamectl set-hostname idp.internal
hostnamectl
```
