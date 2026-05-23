Oracle Database 19c on Oracle Linux 9. Oracle ships the OL9 preinstall RPM in the standard repository.

### 2.1 Install the Oracle preinstall package

```bash
sudo dnf install -y oracle-database-preinstall-19c
```

### 2.2 Install Oracle 19c

Download `oracle-database-ee-19c-*.rpm` from Oracle's site (login required) to `/opt/`.

```bash
cd /opt
sudo dnf localinstall -y oracle-database-ee-19c-*.rpm
```

### 2.3 Create the database

```bash
sudo /etc/init.d/oracledb_ORCLCDB-19c configure
```

| Item       | Value     |
|------------|-----------|
| CDB        | ORCLCDB   |
| PDB        | ORCLPDB1  |
| Listener   | 1521      |

### 2.4 Configure environment variables

```bash
sudo -i -u oracle bash <<'BASH'
cat >> ~/.bash_profile <<'PROFILE'
export ORACLE_BASE=/u01/app/oracle
export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1
export ORACLE_SID=ORCLCDB
export PATH=$ORACLE_HOME/bin:$PATH
PROFILE
source ~/.bash_profile
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

### 2.6 Start the listener

```bash
sudo -i -u oracle bash -c "lsnrctl start || lsnrctl status"
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

### 2.8 Place the Oracle JDBC driver

```bash
sudo mkdir -p /opt/miniorange/drivers
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

> Use **Service Name**, not SID. The IDP schema lives in `ORCLPDB1`.

| Field            | Value          |
|------------------|----------------|
| Database Type    | Oracle         |
| Host             | `127.0.0.1`    |
| Port             | `1521`         |
| SID / Service    | **Service**    |
| Service Name     | `ORCLPDB1`     |
| Username         | `moadmin`      |
| Password         | `Password123`  |
