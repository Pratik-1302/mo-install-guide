MySQL 8.4 LTS on Oracle Linux 8. These steps are **derived** from the MySQL community repo flow plus the JDBC driver convention from the source Oracle 19c documentation; review before production.

### 2.1 Disable the built-in MySQL module

```bash
sudo dnf -qy module disable mysql
```

### 2.2 Add the MySQL community repository

```bash
sudo dnf install -y https://dev.mysql.com/get/mysql84-community-release-el8-1.noarch.rpm
sudo dnf clean all && sudo dnf makecache
```

### 2.3 Install MySQL 8.4

```bash
sudo dnf install -y mysql-community-server mysql-community-client
sudo systemctl enable --now mysqld
```

### 2.4 Retrieve the temporary root password

```bash
sudo grep 'temporary password' /var/log/mysqld.log
```

### 2.5 Secure the installation

```bash
sudo mysql_secure_installation
```

### 2.6 Create the miniOrange database and user

```bash
mysql -u root -p <<'SQL'
CREATE DATABASE miniorangedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moadmin'@'localhost' IDENTIFIED BY 'Password123';
CREATE USER 'moadmin'@'%'         IDENTIFIED BY 'Password123';
GRANT ALL PRIVILEGES ON miniorangedb.* TO 'moadmin'@'localhost';
GRANT ALL PRIVILEGES ON miniorangedb.* TO 'moadmin'@'%';
FLUSH PRIVILEGES;
SQL
```

### 2.7 Place the MySQL JDBC driver (derived assumption)

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-8.4.0-1.el8.noarch.rpm
sudo dnf install -y ./mysql-connector-j-8.4.0-1.el8.noarch.rpm
sudo cp /usr/share/java/mysql-connector-j-8.4.0.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mysql-connector-j-8.4.0.jar
```

### 2.8 Open the MySQL port (only if remote access is needed)

```bash
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

### 2.9 Verify

```bash
mysql -u moadmin -pPassword123 -h 127.0.0.1 -e 'SHOW DATABASES;'
```

### Values for the `/initialize` wizard

| Field           | Value          |
|-----------------|----------------|
| Database Type   | MySQL          |
| Host            | `127.0.0.1`    |
| Port            | `3306`         |
| Database name   | `miniorangedb` |
| Username        | `moadmin`      |
| Password        | `Password123`  |
