Alpine Linux 3.21. Tier 2 in this site because Alpine deviates from the source guide's assumptions in three meaningful ways: it uses **OpenRC** instead of `systemd`, **musl libc** instead of glibc, and **BusyBox** utilities by default instead of the GNU coreutils. Several `mo-installer` and `moctl` paths assume systemd unit files; you may need to author OpenRC service files for the IDP microservices.

> **Tier 2 caveat.** Postgres and MySQL work on Alpine in practice. MSSQL and Oracle are flat-out unsupported because both require glibc.

### 1.1 Update the system

```bash
sudo apk update && sudo apk upgrade
sudo reboot
```

### 1.2 Install bash and GNU coreutils

`mo-installer.sh` and `moctl` expect GNU `sed`, `grep`, `bash`, and a few other utilities. BusyBox alternatives have subtle differences.

```bash
sudo apk add bash bash-completion coreutils sed grep findutils \
  curl wget unzip jq net-tools vim tar lsof
```

### 1.3 Install firewall tooling

Alpine does not include a firewall manager by default.

```bash
sudo apk add iptables ip6tables
sudo rc-update add iptables default
```

For UFW-like ergonomics, install awall (the official Alpine firewall manager) or nftables.

### 1.4 Open IDP ports (iptables)

```bash
for PORT in 8080 8070 8071 8072 6379 5672 15672; do
  sudo iptables -A INPUT -p tcp --dport $PORT -j ACCEPT
done

sudo /etc/init.d/iptables save
```

### 1.5 Service management — OpenRC primer

| systemd command                        | OpenRC equivalent                      |
|----------------------------------------|----------------------------------------|
| `systemctl start <svc>`                | `rc-service <svc> start`               |
| `systemctl stop <svc>`                 | `rc-service <svc> stop`                |
| `systemctl restart <svc>`              | `rc-service <svc> restart`             |
| `systemctl enable <svc>`               | `rc-update add <svc> default`          |
| `systemctl status <svc>`               | `rc-service <svc> status`              |
| `systemctl daemon-reload`              | (not needed; OpenRC re-reads on start) |

### 1.6 No SELinux, no AppArmor

Alpine ships neither by default. No relaxation required.
