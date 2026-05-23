**Oracle Database is not supported on Alpine Linux.** Oracle DB requires `glibc`; Alpine ships `musl`. Oracle has never supported its database on musl libc.

### What to do instead

Run Oracle on any of the supported OSes (Oracle Linux 8/9, RHEL 8/9, SLES 15). On this Alpine IDP host, install the Oracle Instant Client + JDBC driver and point the wizard at the remote Oracle host.

> **Note.** The Instant Client itself is also a glibc binary and will fail to load on Alpine. The IDP only needs the JDBC driver (pure Java), which works fine. You do not need the Instant Client on Alpine.

### JDBC-driver-only path

Download `ojdbc8.jar` (version 19.x) from Oracle's site (login required) and place it directly:

```bash
sudo mkdir -p /opt/miniorange/drivers
sudo cp /tmp/ojdbc8.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/ojdbc8.jar
```

### Values for the `/initialize` wizard (remote Oracle host)

| Field            | Value                              |
|------------------|------------------------------------|
| Database Type    | Oracle                             |
| Host             | `<remote-oracle-host>`             |
| Port             | `1521`                             |
| SID / Service    | **Service**                        |
| Service Name     | `ORCLPDB1`                         |
| Username         | `moadmin`                          |
| Password         | `Password123`                      |
