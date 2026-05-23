PostgreSQL 16 is the default backend for miniOrange IDP 5.0.0. The installer ships the PostgreSQL JDBC driver, so no manual driver placement is needed.

### 2.1 Add the PGDG repository

```bash
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

### 2.2 Disable the built-in PostgreSQL module

RHEL 9 ships an older PostgreSQL via its AppStream module; disabling it avoids a version conflict with PGDG.

```bash
sudo dnf -qy module disable postgresql
```

### 2.3 Install PostgreSQL 16

```bash
sudo dnf install -y postgresql16-server postgresql16 postgresql16-contrib
```

### 2.4 Initialise and start the service

```bash
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
sudo systemctl enable --now postgresql-16
sudo systemctl status postgresql-16
```

### 2.5 Create the miniOrange database and user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER moadmin WITH PASSWORD 'Password123';
CREATE DATABASE miniorangedb OWNER moadmin;
ALTER USER moadmin WITH SUPERUSER;
SQL
```

> **Why SUPERUSER.** The IDP initialisation wizard runs schema creation and migrations on first startup. SUPERUSER avoids permission errors during this step. You can downgrade the role to a constrained owner after initialisation if your policy requires it.

### 2.6 Switch authentication to md5

PostgreSQL on RHEL defaults to `ident` for local TCP connections; the IDP authenticates with username and password over TCP, so switch to `md5`.

```bash
sudo sed -i \
  -E 's/^(host\s+all\s+all\s+(127\.0\.0\.1\/32|::1\/128)\s+)ident/\1md5/' \
  /var/lib/pgsql/16/data/pg_hba.conf

sudo systemctl restart postgresql-16
```

If you want the IDP to connect from a different host, also append a row like `host all moadmin 10.0.0.0/8 md5` and reload.

### 2.7 Open the PostgreSQL port (only if remote access is needed)

```bash
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

### 2.8 Verify

```bash
PGPASSWORD=Password123 psql -h 127.0.0.1 -U moadmin -d miniorangedb -c '\l'
```

`miniorangedb` should appear in the output.

### Values for the `/initialize` wizard

Keep these handy; you'll enter them in Section 5 after the installer finishes.

| Field           | Value          |
|-----------------|----------------|
| Database Type   | PostgreSQL     |
| Host            | `127.0.0.1`    |
| Port            | `5432`         |
| Database name   | `miniorangedb` |
| Username        | `moadmin`      |
| Password        | `Password123`  |
