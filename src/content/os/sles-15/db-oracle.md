Oracle Database 19c on SLES 15. Oracle officially supports 19c on SLES 15 SP2 and later.

### 2.1 Install kernel parameter package

Oracle does not ship a SLES preinstall package. Set kernel parameters manually using `oracle-rdbms-server-12cR1-preinstall` as a reference or use Oracle's SLES 15 installation guide.

```bash
sudo zypper install -y libaio1 libcap-progs libstdc++6 ksh make sysstat unixODBC \
  glibc-devel glibc-locale binutils gcc-c++ libgcc_s1 libstdc++-devel
```

### 2.2 Create the oracle user and groups

```bash
sudo groupadd -g 54321 oinstall
sudo groupadd -g 54322 dba
sudo groupadd -g 54323 oper
sudo useradd -u 54321 -g oinstall -G dba,oper oracle
sudo passwd oracle
```

### 2.3 Configure kernel parameters

```bash
sudo tee /etc/sysctl.d/97-oracle.conf > /dev/null <<'EOF2'
fs.aio-max-nr = 1048576
fs.file-max = 6815744
kernel.shmall = 2097152
kernel.shmmax = 4294967295
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048576
EOF2

sudo sysctl --system
```

### 2.4 Install Oracle 19c

Download `oracle-database-ee-19c-*.rpm` from Oracle. SLES uses the Linux-x86_64 RPM (same as RHEL family).

```bash
cd /opt
sudo rpm -ivh oracle-database-ee-19c-*.rpm --nodeps
sudo /etc/init.d/oracledb_ORCLCDB-19c configure
```

### 2.5 Configure environment variables, open the PDB, start the listener, create the user, place the JDBC driver

The remaining steps are identical to the Oracle Linux 8 path:

- Set `ORACLE_HOME`, `ORACLE_SID`, `PATH` in `oracle` user's `.bash_profile`
- `STARTUP; ALTER PLUGGABLE DATABASE ALL OPEN; ALTER PLUGGABLE DATABASE ALL SAVE STATE;`
- `lsnrctl start`
- Create `moadmin` inside `ORCLPDB1`
- Copy `ojdbc8.jar` from `$ORACLE_HOME/jdbc/lib/` to `/opt/miniorange/drivers/`

Refer to the **Oracle Linux 8 → Oracle** page for the verbatim commands; they are unchanged on SLES 15.

### Values for the `/initialize` wizard

| Field            | Value          |
|------------------|----------------|
| Database Type    | Oracle         |
| Host             | `127.0.0.1`    |
| Port             | `1521`         |
| SID / Service    | **Service**    |
| Service Name     | `ORCLPDB1`     |
| Username         | `moadmin`      |
| Password         | `Password123`  |
