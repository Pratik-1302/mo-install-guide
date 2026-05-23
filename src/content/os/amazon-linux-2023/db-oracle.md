Oracle Database 19c on Amazon Linux 2023. Oracle does not list AL2023 in its supported matrix. The OL8 preinstall RPM approach used on RHEL 9 works in practice, but treat this as partial.

### 2.1 Install the Oracle Database preinstall package

```bash
sudo dnf install -y \
  https://yum.oracle.com/repo/OracleLinux/OL8/appstream/x86_64/getPackage/oracle-database-preinstall-19c-1.0-1.el8.x86_64.rpm \
  --nogpgcheck --skip-broken
```

This creates the `oracle` user, sets kernel parameters, and configures shell limits. On RHEL 9, this is the closest viable path to the OL8 reference flow.

### 2.2 Install Oracle 19c

Download `oracle-database-ee-19c-1.0-1.x86_64.rpm` from Oracle's site (login required) to the server, then:

```bash
cd /opt
sudo dnf localinstall -y oracle-database-ee-19c-1.0-1.x86_64.rpm
```

### 2.3 Create the database

```bash
sudo /etc/init.d/oracledb_ORCLCDB-19c configure
```

This creates the structure:

| Item       | Value     |
|------------|-----------|
| CDB        | ORCLCDB   |
| PDB        | ORCLPDB1  |
| Listener   | 1521      |

### 2.4 Configure Oracle environment variables

```bash
sudo -i -u oracle bash <<'BASH'
cat >> ~/.bash_profile <<'PROFILE'
export ORACLE_BASE=/u01/app/oracle
export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1
export ORACLE_SID=ORCLCDB
export PATH=$ORACLE_HOME/bin:$PATH
PROFILE
source ~/.bash_profile
echo $ORACLE_HOME
BASH
```

### 2.5 Open the PDB and save state

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba" <<'SQL'
STARTUP;
ALTER PLUGGABLE DATABASE ALL OPEN;
ALTER PLUGGABLE DATABASE ALL SAVE STATE;
SHOW PDBS;
SQL
```

`ORCLPDB1` should be in `READ WRITE` state.

### 2.6 Start and verify the listener

```bash
sudo -i -u oracle bash -c "lsnrctl start || lsnrctl status"
sudo ss -tulnp | grep 1521
```

### 2.7 Create the miniOrange Oracle user

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba" <<'SQL'
ALTER SESSION SET CONTAINER=ORCLPDB1;
CREATE USER moadmin IDENTIFIED BY Password123;
GRANT CONNECT, RESOURCE TO moadmin;
GRANT DBA TO moadmin;
SQL
```

Verify connectivity over the service name:

```bash
sudo -i -u oracle bash -c "sqlplus moadmin/Password123@//127.0.0.1:1521/ORCLPDB1 <<< 'SELECT 1 FROM dual;'"
```

### 2.8 Place the Oracle JDBC driver

This step is **required**: Oracle's JDBC driver isn't bundled in `mo-installer` because of Oracle's licensing.

```bash
sudo mkdir -p /opt/miniorange/drivers
sudo find /u01/app/oracle -name 'ojdbc8.jar' -print 2>/dev/null | head -1
sudo cp /u01/app/oracle/product/19.0.0/dbhome_1/jdbc/lib/ojdbc8.jar \
        /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/ojdbc8.jar
```

### 2.9 Open the Oracle port

```bash
sudo firewall-cmd --permanent --add-port=1521/tcp
sudo firewall-cmd --reload
```

### Values for the `/initialize` wizard

> **Important.** Use **Service Name**, not SID. The IDP schema lives in the PDB (`ORCLPDB1`), not the CDB (`ORCLCDB`).

| Field            | Value          |
|------------------|----------------|
| Database Type    | Oracle         |
| Host             | `127.0.0.1`    |
| Port             | `1521`         |
| SID / Service    | **Service**    |
| Service Name     | `ORCLPDB1`     |
| Username         | `moadmin`      |
| Password         | `Password123`  |
