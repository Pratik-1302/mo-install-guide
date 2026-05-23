PostgreSQL 16 on Alpine 3.18. Alpine's main repository ships `postgresql16` natively.

### 2.1 Install PostgreSQL 16

```bash
sudo apk add postgresql16 postgresql16-contrib postgresql16-client
```

### 2.2 Initialise the cluster

Alpine's PG package does not auto-init.

```bash
sudo mkdir -p /var/lib/postgresql/data
sudo chown postgres:postgres /var/lib/postgresql/data
sudo -u postgres initdb -D /var/lib/postgresql/data
```

### 2.3 Configure the OpenRC service

```bash
sudo rc-update add postgresql default
sudo rc-service postgresql start
sudo rc-service postgresql status
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
sudo sed -i -E 's/^(host\s+all\s+all\s+(127\.0\.0\.1\/32|::1\/128)\s+)(ident|trust)/\1md5/' \
  /var/lib/postgresql/data/pg_hba.conf
sudo rc-service postgresql restart
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
