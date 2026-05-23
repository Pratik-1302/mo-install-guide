Before installing any service, update the package repositories and install the tools the `mo-installer` and `moctl` depend on. CentOS Stream 9 is the rolling-release preview of RHEL 9. Commands match the RHEL 9 path. CentOS Stream is not listed in Oracle, Microsoft, or RabbitMQ supported matrices, so most cells are partial.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable the EPEL repository

Rocky Linux ships `epel-release` in its standard repositories.

```bash
sudo dnf install -y epel-release
sudo dnf update -y
```

### 1.3 Enable the CodeReady Linux Builder (CRB)

```bash
sudo dnf config-manager --set-enabled crb
```

### 1.4 Install required utilities

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet firewalld
```

### 1.5 Configure the firewall

```bash
sudo systemctl enable --now firewalld

sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8070/tcp
sudo firewall-cmd --permanent --add-port=8071/tcp
sudo firewall-cmd --permanent --add-port=8072/tcp
sudo firewall-cmd --permanent --add-port=6379/tcp
sudo firewall-cmd --permanent --add-port=5672/tcp
sudo firewall-cmd --permanent --add-port=15672/tcp

sudo firewall-cmd --reload
```

### 1.6 Set SELinux to permissive

```bash
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
```
