Before installing any service, update the package repositories and install the tools the `mo-installer` and `moctl` depend on.

### 1.1 Update the system

```bash
sudo dnf update -y
sudo reboot
```

### 1.2 Enable the EPEL repository

Oracle Linux ships its own EPEL release package.

```bash
sudo dnf install -y oracle-epel-release-el8
sudo dnf update -y
```

### 1.3 Install required utilities

```bash
sudo dnf install -y unzip wget curl jq net-tools vim bash-completion tar lsof telnet firewalld
```

### 1.4 Configure the firewall

The DB port is opened in the database section. Open all the IDP-service and broker ports here.

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

The IDP microservices communicate locally on a wide port range; SELinux enforcing interferes. Persist the change so it survives reboots.

```bash
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
getenforce
```

Expected output: `Permissive`.

### 1.6 Ensure the network reconnects on reboot

If you're using NetworkManager (default on OL8), enable auto-connect on the active interface. Find the connection name first:

```bash
nmcli connection show
```

Then enable auto-connect (substitute your interface name):

```bash
sudo nmcli connection modify enp1s0 connection.autoconnect yes
sudo systemctl restart NetworkManager
hostname -I
```
