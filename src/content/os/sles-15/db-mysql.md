MySQL 8.4 LTS on SLES 15. **Derived** from the MySQL community SLES 15 repo.

### 2.1 Add the MySQL community repository

```bash
sudo zypper addrepo \
  https://repo.mysql.com/yum/mysql-8.4-lts-community/sles/15/x86_64/ \
  mysql-8.4-lts-community
sudo zypper --gpg-auto-import-keys refresh
```

### 2.2 Install MySQL 8.4

```bash
sudo zypper install -y mysql-community-server mysql-community-client
sudo systemctl enable --now mysql
```

### 2.3 Retrieve the temporary root password

```bash
sudo grep 'temporary password' /var/log/mysql/mysqld.log
```

### 2.4 Secure the installation

```bash
sudo mysql_secure_installation
```

### 2.5 Create the miniOrange database and user

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

### 2.6 Place the MySQL JDBC driver (derived)

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-8.4.0-1.el8.noarch.rpm
sudo rpm -ivh --nodeps mysql-connector-j-8.4.0-1.el8.noarch.rpm
sudo cp /usr/share/java/mysql-connector-j-8.4.0.jar /opt/miniorange/drivers/
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
