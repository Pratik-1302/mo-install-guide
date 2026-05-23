Before installing any service, update and install the tools `mo-installer` and `moctl` depend on. Rocky Linux 8 is binary-compatible with RHEL 8.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable EPEL and PowerTools

```bash
sudo dnf install -y epel-release
sudo dnf config-manager --set-enabled powertools
sudo dnf update -y
```

### 1.3 Install required utilities

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet firewalld
```

### 1.4 Configure the firewall

```bash
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-port={8080,8070,8071,8072,6379,5672,15672}/tcp
sudo firewall-cmd --reload
```

### 1.5 Set SELinux to permissive

```bash
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
```
