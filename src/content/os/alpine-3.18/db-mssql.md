**Microsoft SQL Server is not supported on Alpine Linux.** MSSQL on Linux requires `glibc`; Alpine ships `musl`. Microsoft has never supported MSSQL on musl libc and is unlikely to in the foreseeable future.

### What to do instead

Run MSSQL on any of the supported OSes (RHEL 8/9, SLES 15, Ubuntu 20.04/22.04). On this Alpine IDP host, install only the JDBC driver and point the wizard at the remote DB.

### JDBC-driver-only path

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo curl -L -o mssql-jdbc.tar.gz \
  https://download.microsoft.com/download/8/c/d/8cdfd87a-1684-4731-91a9-2ba182c8b0ad/sqljdbc_12.6.4.0_enu.tar.gz
sudo tar -xzf mssql-jdbc.tar.gz
sudo cp sqljdbc_12.6/enu/jars/mssql-jdbc-12.6.4.jre11.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mssql-jdbc-12.6.4.jre11.jar
```

The JDBC driver is pure Java and runs fine on Alpine; only the MSSQL server itself is incompatible.

### Values for the `/initialize` wizard (remote MSSQL host)

| Field           | Value                              |
|-----------------|------------------------------------|
| Database Type   | MSSQL                              |
| Host            | `<remote-mssql-host>`              |
| Port            | `1433`                             |
| Database name   | `miniorangedb`                     |
| Username        | `moadmin`                          |
| Password        | `Password123!`                     |
