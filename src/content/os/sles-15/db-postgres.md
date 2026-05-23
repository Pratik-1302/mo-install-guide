PostgreSQL 16 on SLES 15. PGDG ships SLES 15 packages.

### 2.1 Add the PGDG repository

```bash
sudo zypper addrepo \
  https://download.postgresql.org/pub/repos/zypp/repo/pgdg-sles-15-pg16.repo
sudo zypper --gpg-auto-import-keys refresh
```

### 2.2 Install PostgreSQL 16

```bash
sudo zypper install -y postgresql16-server postgresql16 postgresql16-contrib
```

### 2.3 Initialise and start

The PGDG package on SLES does not auto-init the cluster.

```bash
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
sudo systemctl enable --now postgresql-16
```

### 2.4 Create the miniOrange database and user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER moadmin WITH PASSWORD 'Password123';
CREATE DATABASE miniorangedb OWNER moadmin;
ALTER USER moadmin WITH SUPERUSER;
SQL
```

### 2.5 Switch authentication to md5

```bash
sudo sed -i -E 's/^(host\s+all\s+all\s+(127\.0\.0\.1\/32|::1\/128)\s+)ident/\1md5/' \
  /var/lib/pgsql/16/data/pg_hba.conf
sudo systemctl restart postgresql-16
```

### 2.6 Verify

```bash
PGPASSWORD=Password123 psql -h 127.0.0.1 -U moadmin -d miniorangedb -c '\l'
```

### Values for the `/initialize` wizard

| Field           | Value          |
|-----------------|----------------|
| Database Type   | PostgreSQL     |
| Host            | `127.0.0.1`    |
| Port            | `5432`         |
| Database name   | `miniorangedb` |
| Username        | `moadmin`      |
| Password        | `Password123`  |
