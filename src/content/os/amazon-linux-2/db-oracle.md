Oracle Database 19c on Amazon Linux 2 is **not officially supported** by Oracle. The OL7 preinstall RPM works in practice because AL2 is RHEL 7-derived, but Oracle's matrix does not list AL2.

### Recommended path: run Oracle on a separate host

Install Oracle on an OL8 or RHEL 8 EC2 instance using the **Oracle Linux 8 → Oracle** runbook, then on this AL2 IDP host install only the Instant Client + JDBC driver. The pattern matches the Ubuntu 22.04 → Oracle (Instant Client) page.

### If you must run Oracle locally (partial)

```bash
sudo yum install -y \
  https://yum.oracle.com/repo/OracleLinux/OL7/latest/x86_64/getPackage/oracle-database-preinstall-19c-1.0-3.el7.x86_64.rpm \
  --nogpgcheck
```

Download `oracle-database-ee-19c-*.el7.x86_64.rpm` from Oracle (login required), then:

```bash
cd /opt
sudo yum localinstall -y oracle-database-ee-19c-*.el7.x86_64.rpm
sudo /etc/init.d/oracledb_ORCLCDB-19c configure
```

The post-configure steps (env vars, PDB open, listener, `moadmin` user, JDBC driver placement) are identical to the **Oracle Linux 8 → Oracle** page.

### Values for the `/initialize` wizard

| Field            | Value          |
|------------------|----------------|
| Database Type    | Oracle         |
| Host             | `127.0.0.1` or `<remote-oracle-host>` |
| Port             | `1521`         |
| SID / Service    | **Service**    |
| Service Name     | `ORCLPDB1`     |
| Username         | `moadmin`      |
| Password         | `Password123`  |
