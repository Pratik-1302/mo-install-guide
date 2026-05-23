MySQL 8.4 LTS on Debian 11. These steps are **derived** from the MySQL APT repo install path combined with the JDBC driver placement convention from the source Oracle flow; review before production.

### 2.1 Add the MySQL APT repository

Download the configurator and select **MySQL 8.4 LTS** for the server when prompted.

```bash
cd /tmp
sudo curl -L -O https://dev.mysql.com/get/mysql-apt-config_0.8.32-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.32-1_all.deb
sudo apt update
```

The configurator writes `/etc/apt/sources.list.d/mysql.list`. Verify it points to the `mysql-8.4-lts` channel:

```bash
grep -E 'mysql-8\.4-lts' /etc/apt/sources.list.d/mysql.list
```

### 2.2 Install MySQL 8.4

```bash
sudo apt install -y mysql-community-server mysql-community-client
```

You will be prompted for the `root` password during install. Set a strong password and **remember it**; unlike RHEL, Ubuntu's MySQL package does **not** generate a temporary one in the log.

### 2.3 Start and enable the service

```bash
sudo systemctl enable --now mysql
sudo systemctl status mysql
```

### 2.4 Secure the installation (optional but recommended)

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

### 2.6 Place the MySQL JDBC driver (derived assumption)

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j_8.4.0-1debian12_all.deb
sudo dpkg -i mysql-connector-j_8.4.0-1debian12_all.deb
sudo cp /usr/share/java/mysql-connector-j-8.4.0.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mysql-connector-j-8.4.0.jar
```

### 2.7 Open the MySQL port (only if remote access is needed)

```bash
sudo ufw allow 3306/tcp comment 'mysql'
```

### 2.8 Verify

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
