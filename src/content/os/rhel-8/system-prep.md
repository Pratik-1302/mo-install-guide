Before installing any service, update the package repositories and install the tools the `mo-installer` and `moctl` depend on.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable the CodeReady Linux Builder and EPEL repositories

Several utilities the installer expects live in CodeReady Builder and EPEL.

```bash
sudo subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
sudo dnf update -y
```

> **Note.** If the host is not registered with Red Hat (`subscription-manager status` fails), you can skip the first line and pull EPEL only. A few non-critical EPEL packages depend on CodeReady but the installer flow does not.

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
