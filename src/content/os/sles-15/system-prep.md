SUSE Linux Enterprise Server 15. Uses `zypper` rather than `dnf` or `apt`. Requires either a paid subscription (SUSEConnect) or activated trial registration for repo access.

### 1.1 Register the host with SUSE

```bash
sudo SUSEConnect -r <YOUR-REG-CODE> -e <YOUR-EMAIL>
sudo SUSEConnect --list-extensions
```

Required modules for this install:

| Module                                              | Why                              |
|-----------------------------------------------------|----------------------------------|
| Basesystem Module                                   | Core utilities                   |
| Server Applications Module                          | PostgreSQL community packages    |
| Development Tools Module                            | Compiler toolchain (for some JNI)|

```bash
sudo SUSEConnect -p sle-module-basesystem/15.5/x86_64
sudo SUSEConnect -p sle-module-server-applications/15.5/x86_64
sudo SUSEConnect -p sle-module-development-tools/15.5/x86_64
```

(Substitute `15.5` for your actual SP level. Check with `cat /etc/os-release`.)

### 1.2 Update the system

```bash
sudo zypper refresh
sudo zypper update -y
sudo reboot
```

### 1.3 Install required utilities

```bash
sudo zypper install -y \
  unzip wget curl jq net-tools-deprecated vim bash-completion \
  tar lsof telnet firewalld
```

> **Note.** `net-tools-deprecated` provides `netstat` for SLES 15. The `ss` command from `iproute2` is also available and is preferred in new commands.

### 1.4 Configure the firewall

SLES 15 uses `firewalld` from SP2 onwards. (Earlier SPs used SuSEfirewall2 which is no longer recommended.)

```bash
sudo systemctl enable --now firewalld

sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8070/tcp
sudo firewall-cmd --permanent --add-port=8071/tcp
sudo firewall-cmd --permanent --add-port=8072/tcp
sudo firewall-cmd --permanent --add-port=6379/tcp
sudo firewall-cmd --permanent --add-port=5672/tcp
sudo firewall-cmd --permanent --add-port=15672/tcp

sudo firewall-cmd --reload
```

### 1.5 AppArmor

SLES uses AppArmor by default. No relaxation is required for the IDP services.

```bash
sudo systemctl status apparmor
```
