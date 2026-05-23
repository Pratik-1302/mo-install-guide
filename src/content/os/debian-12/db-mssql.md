**Microsoft does not publish an MSSQL apt repository for Debian.** The Debian community has never been on Microsoft's supported Linux matrix for MSSQL on Linux; only Ubuntu, RHEL, and SLES are listed.

### What this means

A single-host miniOrange + MSSQL deployment is not possible on Debian 12. Two viable workarounds:

1. **Use a different OS for the IDP.** Ubuntu 22.04 is the closest behavioural match to Debian 12; if MSSQL is a hard requirement, switching the IDP host to Ubuntu 22.04 keeps your apt-based ops workflow intact and unlocks the supported MSSQL path.
2. **Run MSSQL on a separate host.** Install MSSQL on RHEL, SLES, or Ubuntu, then on this Debian 12 IDP host place only the JDBC driver and point the wizard at the remote DB.

### JDBC-driver-only path on Debian 12

If you go with option 2:

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
