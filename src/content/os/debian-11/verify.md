### 5.1 Full service status

```bash
moctl service status
```

Every service should show `● running` or `● reachable`. If a service shows `△ registering`, wait 30 seconds and re-run.

### 5.2 Full diagnostics

```bash
moctl diagnose
```

Expected output includes:

```
Database connectivity reachable
Redis reachable
RabbitMQ reachable
```

### 5.3 Individual service status

```bash
sudo systemctl status mo-idp-miniorange.service
sudo systemctl status redis
sudo systemctl status rabbitmq-server
```

### 5.4 Check all bound ports

```bash
sudo ss -tulnp | egrep '8080|8070|8071|8072|6379|5672'
```

For your DB:

| DB         | Port | Listening on   |
|------------|------|----------------|
| PostgreSQL | 5432 | 127.0.0.1      |
| MySQL      | 3306 | 127.0.0.1      |
| MSSQL      | 1433 | 0.0.0.0        |
| Oracle     | 1521 | remote host    |

### 5.5 Preflight

```bash
moctl pre
```

### Quick `moctl` reference

| Command                                | Purpose                                        |
|----------------------------------------|------------------------------------------------|
| `moctl service start`                  | Start all services in order                    |
| `moctl service stop`                   | Stop all services in reverse order             |
| `moctl service restart`                | Full ordered restart                           |
| `moctl service restart miniorange`     | Restart one named service                      |
| `moctl log <service> -f`               | Live tail logs                                 |
| `moctl log <service> --since 1h`       | Logs from the past hour                        |
| `moctl system memory`                  | Per-service RSS memory                         |
| `moctl jvm <service>`                  | Heap, threads, open file descriptors           |

### Common issues on Ubuntu

**Issue: `Could not get lock /var/lib/dpkg/lock-frontend`**

`unattended-upgrades` is running. Wait for it to finish, or stop it temporarily:

```bash
sudo systemctl stop unattended-upgrades
```

**Issue: PostgreSQL connection refused on 127.0.0.1**

The `pg_hba.conf` edit didn't reload. Run:

```bash
sudo systemctl restart postgresql@16-main
```

**Issue: `ufw` blocking inter-service traffic**

The IDP microservices talk to each other on `127.0.0.1` (which `ufw` always allows), but if you've set up custom rules, verify:

```bash
sudo ufw status verbose
```

**Issue: `ldconfig` not finding Oracle Instant Client libraries**

```bash
ls /etc/ld.so.conf.d/ | grep oracle
sudo ldconfig -v 2>&1 | grep -i oracle
```

The `/etc/ld.so.conf.d/oracle-instantclient.conf` file must exist and point to the instantclient directory.

**Issue: Tomcat stale PID after a crash**

```bash
sudo rm -f /opt/tomcat/latest/temp/*.pid
moctl service restart miniorange
```
