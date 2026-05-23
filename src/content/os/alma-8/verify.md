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
Oracle connectivity reachable    (or Database connectivity reachable for non-Oracle)
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

```bash
moctl pre
```

### Validation checklist

Run through this list to confirm a healthy deployment:

| Validation                                       | OK |
|--------------------------------------------------|----|
| DB port active and listening                     | ☐  |
| Redis reachable                                  | ☐  |
| RabbitMQ reachable on port 5672                  | ☐  |
| miniOrange UI accessible via browser             | ☐  |
| (Oracle) ORCLPDB1 in READ WRITE state            | ☐  |
| `moctl diagnose` — all services green            | ☐  |
| Services configured for auto-start               | ☐  |

### Common issues

**Issue: `ORA-01034: ORACLE not available` (Oracle only)**

The DB isn't started.

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba <<< 'STARTUP;'"
```

**Issue: `Listener supports no services` (Oracle only)**

The DB started after the listener, or the PDB isn't open.

```bash
sudo -i -u oracle bash -c "sqlplus -S / as sysdba" <<'SQL'
ALTER PLUGGABLE DATABASE ALL OPEN;
SQL
sudo -i -u oracle bash -c "lsnrctl status"
```

**Issue: Cannot connect to `ORCLPDB1` (Oracle only)**

You used SID mode instead of Service Name mode in the UI. In the wizard, set **SID/Service = Service** and **Service Name = ORCLPDB1**.

**Issue: `RabbitMQ reachable: false`**

```bash
sudo systemctl restart rabbitmq-server
sudo ss -tulnp | grep 5672
sudo rabbitmqctl status
```

**Issue: `miniOrange version shows 1.0.0`**

The schema migration didn't complete. Connect to the DB and check tables exist; if not, restart all services and retry the initialize step.

**Issue: Tomcat stale PID after a crash**

```bash
sudo rm -f /opt/tomcat/latest/temp/*.pid
moctl service restart miniorange
```
