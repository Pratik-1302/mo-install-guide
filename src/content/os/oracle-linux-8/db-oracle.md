Oracle Database 19c on Oracle Linux 8. This is the **source-of-truth combination** from the v5.0.0 deployment guide.

### 2.1 Install the Oracle preinstall package

```bash
sudo dnf install -y oracle-database-preinstall-19c
```

This creates the `oracle` user, sets kernel parameters, and configures shell limits.

### 2.2 Install Oracle 19c

Download `oracle-database-ee-19c-*.rpm` from Oracle's site (login required) to the server, then:

```bash
cd /opt
sudo dnf localinstall -y oracle-database-ee-19c-*.rpm
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

### 2.5 Start the database and open the PDB

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba" <<'SQL'
STARTUP;
ALTER PLUGGABLE DATABASE ALL OPEN;
ALTER PLUGGABLE DATABASE ALL SAVE STATE;
SHOW PDBS;
SQL
```

Expected output for the last command:

```
ORCLPDB1    READ WRITE
```

### 2.6 Start and verify the listener

```bash
sudo -i -u oracle bash -c "lsnrctl start || lsnrctl status"
sudo ss -tulnp | grep 1521
```

Expected from `lsnrctl status`: `Service "ORCLPDB1" has 1 instance(s)`.

### 2.7 Create the miniOrange Oracle user

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba" <<'SQL'
ALTER SESSION SET CONTAINER=ORCLPDB1;
CREATE USER moadmin IDENTIFIED BY Password123;
GRANT CONNECT, RESOURCE TO moadmin;
GRANT DBA TO moadmin;
SQL
```

Verify over the service name:

```bash
sudo -i -u oracle bash -c "sqlplus moadmin/Password123@//127.0.0.1:1521/ORCLPDB1 <<< 'SELECT 1 FROM dual;'"
```

### 2.8 Configure Oracle to auto-start

```bash
sudo systemctl enable oracle-database
systemctl list-units | grep oracle
```

> **Note.** If the `oracle-database` systemd unit is not present, a custom startup script is required. Confirm with your DBA which unit name the deployment uses.

### 2.9 Place the Oracle JDBC driver

This step is **required**. The miniOrange installer does not bundle the Oracle JDBC driver because of Oracle's licensing.

```bash
sudo mkdir -p /opt/miniorange/drivers
sudo find /u01/app/oracle -name 'ojdbc8.jar' -print 2>/dev/null | head -1
sudo cp /u01/app/oracle/product/19.0.0/dbhome_1/jdbc/lib/ojdbc8.jar \
        /opt/miniorange/drivers/
sudo chmod 644 /opt/miniorange/drivers/ojdbc8.jar
```

### 2.10 Open the Oracle port

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
