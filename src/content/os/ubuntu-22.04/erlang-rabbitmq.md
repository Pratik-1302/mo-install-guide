RabbitMQ is used by the IDP for internal messaging between microservices. It requires Erlang. On Ubuntu, both are installed from the official Cloudsmith-hosted apt repositories curated by the RabbitMQ team.

> **Note.** RabbitMQ is not bundled with `mo-installer` and must be installed before running the installer.

### 3.1 Install Erlang prerequisites

```bash
sudo apt install -y curl gnupg apt-transport-https
```

### 3.2 Add Erlang and RabbitMQ signing keys

```bash
# RabbitMQ signing key
sudo curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/3.0/rabbitmq-release-signing-key.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/com.rabbitmq.team.gpg

# Erlang (Cloudsmith) key
sudo curl -fsSL https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/gpg.E495BB49CC4BBE5B.key | \
  sudo gpg --dearmor -o /usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg

# RabbitMQ server (Cloudsmith) key
sudo curl -fsSL https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/gpg.9F4587F226208342.key | \
  sudo gpg --dearmor -o /usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg
```

### 3.3 Add the Cloudsmith apt sources

```bash
sudo tee /etc/apt/sources.list.d/rabbitmq.list > /dev/null <<'SOURCES'
## Erlang
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] \
  https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] \
  https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main

## RabbitMQ server
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] \
  https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] \
  https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
SOURCES

sudo apt update
```

### 3.4 Install Erlang

```bash
sudo apt install -y \
  erlang-base erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
  erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
  erlang-runtime-tools erlang-snmp erlang-ssl erlang-syntax-tools \
  erlang-tftp erlang-tools erlang-xmerl
```

### 3.5 Install RabbitMQ

```bash
sudo apt install -y rabbitmq-server --fix-missing
```

### 3.6 Enable and start the service

```bash
sudo systemctl enable --now rabbitmq-server
sudo systemctl status rabbitmq-server
```

### 3.7 Enable the management plugin

```bash
sudo rabbitmq-plugins enable rabbitmq_management
sudo systemctl restart rabbitmq-server
```

### 3.8 Verify

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
