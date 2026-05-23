Before installing any service, update the package repositories and install the tools the `mo-installer` and `moctl` depend on.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable the EPEL repository

Oracle Linux ships its own EPEL release package, matched to the OL9 version.

```bash
sudo dnf install -y oracle-epel-release-el9
sudo dnf update -y
```

### 1.3 Install required utilities

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet firewalld
```

### 1.4 Configure the firewall

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

### 1.5 Set SELinux to permissive

```bash
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
getenforce
```

### 1.6 Ensure the network reconnects on reboot

```bash
nmcli connection show
sudo nmcli connection modify <interface> connection.autoconnect yes
```
