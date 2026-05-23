Microsoft SQL Server 2022 on RHEL 9. Microsoft officially supports MSSQL on RHEL 9. The IDP wiring is **derived** from the Oracle source flow (driver placement) plus the standard `mssql-server` install.

### 2.1 Verify system requirements

MSSQL on Linux requires **at least 2 GB of RAM**. Verify before installing.

```bash
free -h
```

### 2.2 Add the Microsoft repository

```bash
sudo curl -o /etc/yum.repos.d/mssql-server.repo \
  https://packages.microsoft.com/config/rhel/9/mssql-server-2022.repo
sudo curl -o /etc/yum.repos.d/msprod.repo \
  https://packages.microsoft.com/config/rhel/9/prod.repo
```

### 2.3 Install MSSQL 2022 and tools

```bash
sudo dnf install -y mssql-server
sudo ACCEPT_EULA=Y dnf install -y mssql-tools18 unixODBC-devel
```

### 2.4 Run the initial setup

Pick the Developer edition for non-production; pick Standard or Enterprise for production. Set a strong `sa` password (uppercase, lowercase, digit, symbol, 8+ characters).

```bash
sudo /opt/mssql/bin/mssql-conf setup
sudo systemctl enable --now mssql-server
sudo systemctl status mssql-server
```

### 2.5 Add the tools to PATH

```bash
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' | sudo tee /etc/profile.d/mssql.sh
source /etc/profile.d/mssql.sh
```

### 2.6 Create the miniOrange database and login

Replace `<SA_PASSWORD>` with the password you set in step 2.4.

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

> **Note.** MSSQL enforces password complexity by default. `Password123` will be rejected; `Password123!` works.

### 2.7 Place the MSSQL JDBC driver (derived assumption)

By analogy with the Oracle source flow, MSSQL likely needs the JDBC driver in `/opt/miniorange/drivers/`. Confirm with miniOrange support.

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo curl -L -o mssql-jdbc.zip \
  https://download.microsoft.com/download/8/c/d/8cdfd87a-1684-4731-91a9-2ba182c8b0ad/sqljdbc_12.6.4.0_enu.tar.gz
sudo tar -xzf mssql-jdbc.zip
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

`miniorangedb` should appear.

### Values for the `/initialize` wizard

| Field           | Value           |
|-----------------|-----------------|
| Database Type   | MSSQL           |
| Host            | `127.0.0.1`     |
| Port            | `1433`          |
| Database name   | `miniorangedb`  |
| Username        | `moadmin`       |
| Password        | `Password123!`  |
