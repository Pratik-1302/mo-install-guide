Microsoft SQL Server 2022 on SLES 15. Microsoft officially supports MSSQL on SLES 15.

### 2.1 Verify system requirements

```bash
free -h
```

### 2.2 Add the Microsoft repository

```bash
sudo zypper addrepo -fc \
  https://packages.microsoft.com/config/sles/15/mssql-server-2022.repo
sudo zypper addrepo -fc \
  https://packages.microsoft.com/config/sles/15/prod.repo
sudo zypper --gpg-auto-import-keys refresh
```

### 2.3 Install MSSQL 2022 and tools

```bash
sudo zypper install -y mssql-server
sudo ACCEPT_EULA=Y zypper install -y mssql-tools18 unixODBC-devel
```

### 2.4 Run the initial setup

```bash
sudo /opt/mssql/bin/mssql-conf setup
sudo systemctl enable --now mssql-server
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

### 2.7 Place the MSSQL JDBC driver (derived)

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo curl -L -o mssql-jdbc.tar.gz \
  https://download.microsoft.com/download/8/c/d/8cdfd87a-1684-4731-91a9-2ba182c8b0ad/sqljdbc_12.6.4.0_enu.tar.gz
sudo tar -xzf mssql-jdbc.tar.gz
sudo cp sqljdbc_12.6/enu/jars/mssql-jdbc-12.6.4.jre11.jar /opt/miniorange/drivers/
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
