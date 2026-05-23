Microsoft SQL Server 2022 on Oracle Linux 8 is **not officially listed** by Microsoft, but works in practice because OL8 is binary-compatible with RHEL 8. These steps are **derived** from the RHEL 8 install path plus the JDBC driver convention from the source Oracle flow.

### 2.1 Verify system requirements

MSSQL on Linux requires at least 2 GB of RAM.

```bash
free -h
```

### 2.2 Add the Microsoft repository (using the RHEL 8 repo)

```bash
sudo curl -o /etc/yum.repos.d/mssql-server.repo \
  https://packages.microsoft.com/config/rhel/8/mssql-server-2022.repo
sudo curl -o /etc/yum.repos.d/msprod.repo \
  https://packages.microsoft.com/config/rhel/8/prod.repo
```

### 2.3 Install MSSQL 2022 and tools

```bash
sudo dnf install -y mssql-server
sudo ACCEPT_EULA=Y dnf install -y mssql-tools18 unixODBC-devel
```

### 2.4 Run the initial setup

```bash
sudo /opt/mssql/bin/mssql-conf setup
sudo systemctl enable --now mssql-server
sudo systemctl status mssql-server
```

### 2.5 Add tools to PATH

```bash
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' | sudo tee /etc/profile.d/mssql.sh
source /etc/profile.d/mssql.sh
```

### 2.6 Create the miniOrange database and login

```bash
sqlcmd -S localhost -U SA -P '<SA_PASSWORD>' -C -Q "
CREATE DATABASE miniorangedb;
GO
CREATE LOGIN moadmin WITH PASSWORD = 'Password123!';
GO
USE miniorangedb;
CREATE USER moadmin FOR LOGIN moadmin;
ALTER ROLE db_owner ADD MEMBER moadmin;
GO
"
```

> MSSQL enforces password complexity. `Password123!` passes; plain `Password123` does not.

### 2.7 Place the MSSQL JDBC driver (derived assumption)

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo curl -L -o mssql-jdbc.tar.gz \
  https://download.microsoft.com/download/8/c/d/8cdfd87a-1684-4731-91a9-2ba182c8b0ad/sqljdbc_12.6.4.0_enu.tar.gz
sudo tar -xzf mssql-jdbc.tar.gz
sudo cp sqljdbc_12.6/enu/jars/mssql-jdbc-12.6.4.jre11.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mssql-jdbc-12.6.4.jre11.jar
```

### 2.8 Open the MSSQL port

```bash
sudo firewall-cmd --permanent --add-port=1433/tcp
sudo firewall-cmd --reload
```

### 2.9 Verify

```bash
sqlcmd -S localhost -U moadmin -P 'Password123!' -C -Q "SELECT name FROM sys.databases;"
```

### Values for the `/initialize` wizard

| Field           | Value           |
|-----------------|-----------------|
| Database Type   | MSSQL           |
| Host            | `127.0.0.1`     |
| Port            | `1433`          |
| Database name   | `miniorangedb`  |
| Username        | `moadmin`       |
| Password        | `Password123!`  |
