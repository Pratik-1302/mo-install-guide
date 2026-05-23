Microsoft SQL Server 2022 on Ubuntu 20.04. Microsoft officially supports MSSQL on Ubuntu 20.04. The IDP wiring is **derived** from the Oracle source flow (driver placement) plus the Microsoft `mssql-server` install instructions.

### 2.1 Verify system requirements

MSSQL on Linux requires at least 2 GB of RAM.

```bash
free -h
```

### 2.2 Add the Microsoft repository

```bash
sudo curl https://packages.microsoft.com/keys/microsoft.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/microsoft.gpg

curl -fsSL https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2022.list | \
  sudo tee /etc/apt/sources.list.d/mssql-server.list
curl -fsSL https://packages.microsoft.com/config/ubuntu/20.04/prod.list | \
  sudo tee /etc/apt/sources.list.d/msprod.list

sudo apt update
```

### 2.3 Install MSSQL 2022 and tools

```bash
sudo apt install -y mssql-server
sudo ACCEPT_EULA=Y apt install -y mssql-tools18 unixodbc-dev
```

### 2.4 Run the initial setup

Pick the Developer edition for non-production; pick Standard or Enterprise for production. Set a strong `sa` password (uppercase, lowercase, digit, symbol, 8+ characters).

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

Replace `<SA_PASSWORD>` with the password from step 2.4.

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

> **Note.** MSSQL enforces password complexity. `Password123!` passes; plain `Password123` does not.

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
sudo ufw allow 1433/tcp comment 'mssql'
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
