RabbitMQ requires Erlang. On SLES 15, install both from the OpenSUSE Build Service (OBS) or the official RabbitMQ RPM releases on GitHub.

### 3.1 Add OpenSUSE Erlang repository

```bash
sudo zypper addrepo \
  https://download.opensuse.org/repositories/devel:/languages:/erlang/SLE_15_SP5/devel:languages:erlang.repo
sudo zypper --gpg-auto-import-keys refresh
```

### 3.2 Install Erlang

```bash
sudo zypper install -y erlang
```

### 3.3 Install RabbitMQ from upstream RPM

```bash
sudo zypper install -y \
  https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7-1.suse.noarch.rpm \
  --no-gpg-checks
```

If no `.suse.noarch.rpm` is published for the version you want, the `.el8.noarch.rpm` build runs on SLES 15 in practice:

```bash
sudo zypper install -y --allow-unsigned-rpm \
  https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7-1.el8.noarch.rpm
```

### 3.4 Enable and start the service

```bash
sudo systemctl enable --now rabbitmq-server
```

### 3.5 Enable the management plugin

```bash
sudo rabbitmq-plugins enable rabbitmq_management
sudo systemctl restart rabbitmq-server
```

### 3.6 Verify

```bash
sudo rabbitmqctl status
sudo ss -tulnp | grep 5672
```

### Values for the `/initialize` wizard

| Field         | Value             |
|---------------|-------------------|
| RabbitMQ Host | `127.0.0.1`       |
| AMQP Port     | `5672`            |
| Mgmt UI Port  | `15672`           |
| Default Login | `guest` / `guest` |
