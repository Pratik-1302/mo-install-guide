**As of mo-install-guide v0.1.0, Microsoft has not published an `mssql-server-2022` apt repository for Ubuntu 24.04** at `packages.microsoft.com/config/ubuntu/24.04/`. The installation flow used for Ubuntu 22.04 cannot complete because step 2.2 will 404 against `mssql-server-2022.list`.

### What works today

You have three options if MSSQL is required:

1. **Wait for Microsoft to publish the 24.04 repo.** Track `https://packages.microsoft.com/config/ubuntu/` for the appearance of a `24.04/` directory. When it lands, the Ubuntu 22.04 page in this site is a near-drop-in replacement (swap `22.04` for `24.04` in two URLs).
2. **Install on Ubuntu 22.04 instead.** The IDP itself is OS-agnostic; running MSSQL on 22.04 and pointing the IDP at it is supported.
3. **Use a remote MSSQL host.** Install MSSQL on any of the Microsoft-supported OSes (RHEL 8/9, SLES 15, Ubuntu 22.04), then on this Ubuntu 24.04 IDP host install only the SQL Server JDBC driver.

### JDBC-driver-only path on Ubuntu 24.04

If you go with option 3, the only step needed on this host is the JDBC driver placement.

```bash
sudo mkdir -p /opt/miniorange/drivers
cd /tmp
sudo curl -L -o mssql-jdbc.tar.gz \
  https://download.microsoft.com/download/8/c/d/8cdfd87a-1684-4731-91a9-2ba182c8b0ad/sqljdbc_12.6.4.0_enu.tar.gz
sudo tar -xzf mssql-jdbc.tar.gz
sudo cp sqljdbc_12.6/enu/jars/mssql-jdbc-12.6.4.jre11.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/mssql-jdbc-12.6.4.jre11.jar
```

### Values for the `/initialize` wizard (remote MSSQL host)

| Field           | Value                              |
|-----------------|------------------------------------|
| Database Type   | MSSQL                              |
| Host            | `<mssql-host>` (remote DB IP)      |
| Port            | `1433`                             |
| Database name   | `miniorangedb`                     |
| Username        | `moadmin`                          |
| Password        | `Password123!`                     |
