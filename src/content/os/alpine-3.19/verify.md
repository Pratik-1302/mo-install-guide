### 5.1 Service status (OpenRC)

```bash
sudo rc-status default
```

All `mo-*` services should be `started`. Also check Redis and RabbitMQ:

```bash
sudo rc-service redis status
sudo rc-service rabbitmq-server status
```

### 5.2 moctl diagnostics

If `moctl` runs on Alpine (depends on whether its bash compatibility holds):

```bash
moctl diagnose
moctl service status
```

If `moctl` errors with BusyBox-vs-GNU coreutil differences, check `which sed`, `which grep`, and ensure GNU versions from Section 1.2 are first in `$PATH`.

### 5.3 Port checks

```bash
sudo ss -tulnp | egrep '8080|8070|8071|8072|6379|5672'
```

### 5.4 Tier 2 limitations to expect

| Limitation                            | Workaround                                  |
|---------------------------------------|---------------------------------------------|
| MSSQL server cannot run on Alpine     | Run MSSQL on a remote host (see DB section) |
| Oracle DB cannot run on Alpine        | Run Oracle on a remote host                 |
| `mo-installer` writes systemd units   | Author OpenRC init scripts manually         |
| `moctl` may rely on GNU tools         | Install `coreutils`, `bash`, `sed`, `grep`  |

### 5.5 When to abandon Alpine and pick a Tier 1 OS

Alpine is appropriate for containerised IDP-on-IDP deployments where you control the image build and accept the operational overhead of OpenRC init scripting. For VM-based or bare-metal production, a Tier 1 distribution (RHEL 9, Ubuntu 22.04, Oracle Linux 8) avoids the workarounds above.
