Before installing any service, update the package repositories and install the tools `mo-installer` and `moctl` depend on. Debian uses `apt` like Ubuntu but ships fewer packages by default.

### 1.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### 1.2 Install required utilities

```bash
sudo apt install -y \
  unzip wget curl jq net-tools vim bash-completion \
  ca-certificates gnupg lsb-release \
  lsof telnet sudo
```

### 1.3 Configure the firewall

Debian does not install `ufw` by default. Install it before configuring.

```bash
sudo apt install -y ufw
sudo systemctl enable --now ufw

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh

sudo ufw allow 8080/tcp comment 'miniorange'
sudo ufw allow 8070/tcp comment 'eurekaserver'
sudo ufw allow 8071/tcp comment 'configserver'
sudo ufw allow 8072/tcp comment 'gatekeeper'
sudo ufw allow 6379/tcp comment 'redis'
sudo ufw allow 5672/tcp comment 'rabbitmq-amqp'
sudo ufw allow 15672/tcp comment 'rabbitmq-mgmt'

sudo ufw --force enable
sudo ufw status verbose
```

### 1.4 AppArmor

Debian ships AppArmor but with fewer enforcing profiles than Ubuntu by default. No relaxation is required for the IDP.

```bash
sudo apt install -y apparmor apparmor-utils
sudo aa-status | head -5
```
