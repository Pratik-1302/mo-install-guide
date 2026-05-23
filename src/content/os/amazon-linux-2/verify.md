Confirm everything is running and registered. All commands here come from the source v5.0.0 guide.

### 5.1 Full service status

```bash
moctl service status
```

Every service should show `● running` or `● reachable`. If anything shows `△ registering`, wait 30 seconds and re-run.

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
systemctl status mo-idp-miniorange.service
systemctl status redis
systemctl status rabbitmq-server
```

### 5.4 Check all bound ports

```bash
sudo ss -tulnp | egrep '8080|8070|8071|8072|6379|5672'
```

For your DB:

| DB         | Port |
|------------|------|
| PostgreSQL | 5432 |
| MySQL      | 3306 |
| MSSQL      | 1433 |
| Oracle     | 1521 |

### 5.5 Preflight

`moctl pre` checks Java, the DB, Redis, and RabbitMQ reachability in one go.

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
| `moctl diagnose ports`                 | Check that core ports are bound                |

### Common issues

**Issue: `△ registering` after a minute.**

The service started but hasn't completed its handshake with Eureka. Check the gatekeeper log:

```bash
moctl log gatekeeper --since 5min
```

**Issue: PostgreSQL `peer authentication failed`.**

You modified `pg_hba.conf` but didn't restart. Run `sudo systemctl restart postgresql-16`.

**Issue: SELinux denials in `audit.log`.**

You skipped section 1.5. Set `setenforce 0` and re-check `getenforce`.

**Issue: Tomcat stale PID after a crash.**

```bash
sudo rm -f /opt/tomcat/latest/temp/*.pid
moctl service restart miniorange
```
