PostgreSQL 16 on Debian 12 (bookworm). Ubuntu's universe ships PostgreSQL 14, which is too old; add the official PGDG apt repository to get 16. The installer ships the PostgreSQL JDBC driver, so no manual driver placement is needed.

### 2.1 Add the PGDG apt repository

```bash
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc

echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
  https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" | \
  sudo tee /etc/apt/sources.list.d/pgdg.list

sudo apt update
```

### 2.2 Install PostgreSQL 16

```bash
sudo apt install -y postgresql-16 postgresql-client-16 postgresql-contrib-16
```

### 2.3 Start the service

The Debian/Ubuntu PostgreSQL packaging initialises a cluster automatically on install.

```bash
sudo systemctl enable --now postgresql
sudo systemctl status postgresql@16-main
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
sudo sed -i \
  -E 's/^(host\s+all\s+all\s+(127\.0\.0\.1\/32|::1\/128)\s+)(peer|ident|scram-sha-256)/\1md5/' \
  /etc/postgresql/16/main/pg_hba.conf

sudo systemctl restart postgresql@16-main
```

> **Note.** Ubuntu's PostgreSQL config lives in `/etc/postgresql/16/main/` (not `/var/lib/pgsql/16/data/` as on RHEL). The data directory is `/var/lib/postgresql/16/main/`.

### 2.6 Open the PostgreSQL port (only if remote access is needed)

```bash
sudo ufw allow 5432/tcp comment 'postgres'
```

### 2.7 Verify

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
