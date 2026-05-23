> **Partial support.** Oracle does not ship Oracle Database 19c for Debian or Ubuntu. The native install path used on Oracle Linux 8 and RHEL 9 (preinstall RPM, server RPM, `sqlplus`, listener auto-config) is **not** available here. The supported pattern for Oracle on Ubuntu is: run the Oracle Database itself on a separate Oracle Linux or RHEL host, and on the Ubuntu IDP host install only the **Instant Client** so the IDP can connect remotely.

This page covers the Ubuntu side: Instant Client install plus JDBC driver placement. The actual Oracle Database setup (preinstall, `oracle-database-ee-19c`, PDB, listener, `moadmin` user) is identical to the Oracle Linux 8 flow on the remote DB host.

### 2.1 Confirm the remote Oracle target

Before starting, you should have a reachable Oracle 19c host with:

- A pluggable database called `ORCLPDB1` open and saved
- A listener on TCP port 1521
- A `moadmin` user inside `ORCLPDB1` with `CONNECT, RESOURCE, DBA`
- Network reachability from the Ubuntu IDP host (firewall, route, no NAT issues)

If you do not yet have such a host, follow the **Oracle Linux 8 → Oracle** runbook on the target server first.

### 2.2 Install prerequisite packages

```bash
sudo apt install -y libaio1 unzip wget alien
```

`alien` lets you convert Oracle's RPM Instant Client packages into `.deb` if you prefer; the Instant Client also ships a zip variant which is simpler.

### 2.3 Download Oracle Instant Client 19c (Basic + SQL*Plus + JDBC)

Download these three zips from Oracle's Instant Client page (login required) to `/tmp/`:

- `instantclient-basic-linux.x64-19.x.x.x.x.zip`
- `instantclient-sqlplus-linux.x64-19.x.x.x.x.zip`
- `instantclient-jdbc-linux.x64-19.x.x.x.x.zip`

### 2.4 Extract to `/opt/oracle`

```bash
sudo mkdir -p /opt/oracle
cd /opt/oracle
sudo unzip -o /tmp/instantclient-basic-linux.x64-*.zip
sudo unzip -o /tmp/instantclient-sqlplus-linux.x64-*.zip
sudo unzip -o /tmp/instantclient-jdbc-linux.x64-*.zip
ls /opt/oracle
```

You should see a single directory like `/opt/oracle/instantclient_19_23/`.

### 2.5 Configure environment and linker

```bash
INSTANT_CLIENT_DIR=$(ls -d /opt/oracle/instantclient_19_* | head -1)

sudo tee /etc/profile.d/oracle.sh > /dev/null <<EOF
export LD_LIBRARY_PATH=${INSTANT_CLIENT_DIR}:\$LD_LIBRARY_PATH
export PATH=${INSTANT_CLIENT_DIR}:\$PATH
EOF
sudo chmod +x /etc/profile.d/oracle.sh
source /etc/profile.d/oracle.sh

echo "${INSTANT_CLIENT_DIR}" | sudo tee /etc/ld.so.conf.d/oracle-instantclient.conf
sudo ldconfig
```

### 2.6 Verify the client

Replace `<oracle-host>` with the IP or hostname of the remote Oracle DB.

```bash
sqlplus moadmin/Password123@//<oracle-host>:1521/ORCLPDB1 <<< 'SELECT 1 FROM dual;'
```

You should see `1` returned. If you see `TNS:could not resolve the connect identifier`, your network path to the Oracle host is blocked.

### 2.7 Place the Oracle JDBC driver

The Instant Client JDBC zip extracts `ojdbc8.jar` into the same instantclient directory. Copy it into `/opt/miniorange/drivers/`.

```bash
INSTANT_CLIENT_DIR=$(ls -d /opt/oracle/instantclient_19_* | head -1)
sudo mkdir -p /opt/miniorange/drivers
sudo cp ${INSTANT_CLIENT_DIR}/ojdbc8.jar /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/ojdbc8.jar
```

### Values for the `/initialize` wizard

> **Important.** Use **Service Name**, not SID. The IDP schema lives in the PDB (`ORCLPDB1`).

| Field            | Value                              |
|------------------|------------------------------------|
| Database Type    | Oracle                             |
| Host             | `<oracle-host>` (the remote DB IP) |
| Port             | `1521`                             |
| SID / Service    | **Service**                        |
| Service Name     | `ORCLPDB1`                         |
| Username         | `moadmin`                          |
| Password         | `Password123`                      |
