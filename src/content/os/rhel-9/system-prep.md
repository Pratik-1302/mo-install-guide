Before installing any service, update the package repositories and install the developer tools the `mo-installer` and `moctl` depend on.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable the EPEL repository

EPEL provides utilities that the installer expects (`jq`, `bash-completion`, and others) but RHEL doesn't ship by default.

```bash
sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
sudo dnf update -y
```

> **Note.** If `subscription-manager` is not registered, also enable the CodeReady Linux Builder repo: `sudo subscription-manager repos --enable codeready-builder-for-rhel-9-$(arch)-rpms`.

### 1.3 Install required utilities

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet firewalld
```

### 1.4 Configure the firewall

Open the ports the IDP needs. The DB port (5432 for Postgres, 3306 for MySQL, 1433 for MSSQL, 1521 for Oracle) is opened in the database section.

```bash
sudo systemctl enable --now firewalld

# IDP service ports
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8070/tcp
sudo firewall-cmd --permanent --add-port=8071/tcp
sudo firewall-cmd --permanent --add-port=8072/tcp

# Redis (bundled with installer) and RabbitMQ
sudo firewall-cmd --permanent --add-port=6379/tcp
sudo firewall-cmd --permanent --add-port=5672/tcp
sudo firewall-cmd --permanent --add-port=15672/tcp

sudo firewall-cmd --reload
```

### 1.5 Set SELinux to permissive

The IDP microservices communicate locally on a wide port range; SELinux enforcing blocks parts of that. Persist the change so it survives reboots.

```bash
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
getenforce
```

Expected output: `Permissive`.

> **Note.** RHEL 9 ships nftables under the hood for `firewalld`. The commands above are unchanged from RHEL 8, but if you've replaced firewalld with raw nftables, manage the equivalent rules yourself.
