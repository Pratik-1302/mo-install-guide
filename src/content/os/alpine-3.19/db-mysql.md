MySQL 8.4 LTS on Alpine 3.19. **Derived and partial**. Alpine's official package is MariaDB, not MySQL. Two options:

1. **Use MariaDB** as a wire-compatible replacement. The IDP officially supports MySQL 5.7+/8.x; MariaDB 10.11 is mostly compatible but is not on the support matrix.
2. **Run MySQL on a separate host** (Ubuntu, RHEL, SLES) and connect from this Alpine IDP host using only the JDBC driver.

This page covers option 1 (MariaDB) plus the JDBC driver placement.

### 2.1 Install MariaDB 10.11

```bash
sudo apk add mariadb mariadb-client mariadb-common
```

### 2.2 Initialise the system tables

```bash
sudo /etc/init.d/mariadb setup
```

### 2.3 Start and enable the service

```bash
sudo rc-update add mariadb default
sudo rc-service mariadb start
```

### 2.4 Secure the installation

```bash
sudo /usr/bin/mysql_secure_installation
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

The MySQL JDBC driver is built against generic Java and works against MariaDB 10.5+ for typical CRUD operations the IDP performs.

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo wget https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.4.0/mysql-connector-j-8.4.0.jar
sudo cp mysql-connector-j-8.4.0.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mysql-connector-j-8.4.0.jar
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
