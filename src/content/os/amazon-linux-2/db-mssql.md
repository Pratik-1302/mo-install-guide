Microsoft SQL Server 2022 on Amazon Linux 2 is **not officially supported** by Microsoft. AL2 is RHEL 7-derived, but Microsoft's RHEL 7 packages stopped at MSSQL 2019. The RHEL 8 repo cannot be coaxed onto AL2 because of glibc version differences.

### What works today

- **MSSQL 2019** can be installed using the Microsoft RHEL 7 repo (`packages.microsoft.com/config/rhel/7/`). The IDP supports MSSQL 2017+, so this is a viable downgrade path.
- **MSSQL 2022** requires a different host. Run MSSQL on RHEL 8/9, SLES 15, or Ubuntu 20.04/22.04, and on this AL2 IDP host place only the JDBC driver.

### MSSQL 2019 on AL2 (partial)

```bash
sudo curl -o /etc/yum.repos.d/mssql-server.repo \
  https://packages.microsoft.com/config/rhel/7/mssql-server-2019.repo
sudo curl -o /etc/yum.repos.d/msprod.repo \
  https://packages.microsoft.com/config/rhel/7/prod.repo
sudo yum install -y mssql-server
sudo ACCEPT_EULA=Y yum install -y mssql-tools18 unixODBC-devel
sudo /opt/mssql/bin/mssql-conf setup
sudo systemctl enable --now mssql-server
```

### JDBC-driver-only path (remote MSSQL 2022)

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
| Host            | `127.0.0.1` or `<remote-mssql-host>` |
| Port            | `1433`          |
| Database name   | `miniorangedb`  |
| Username        | `moadmin`       |
| Password        | `Password123!`  |
