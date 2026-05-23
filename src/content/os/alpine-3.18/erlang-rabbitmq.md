RabbitMQ and Erlang on Alpine 3.18. Both are in the community repository.

### 3.1 Enable the community repository

It's usually enabled by default but verify:

```bash
grep '^http' /etc/apk/repositories
```

You should see a line like `http://dl-cdn.alpinelinux.org/alpine/v3.18/community`. If not, add it and `apk update`.

### 3.2 Install Erlang

```bash
sudo apk add erlang erlang-dev
```

### 3.3 Install RabbitMQ

```bash
sudo apk add rabbitmq-server
```

> **Version note.** Alpine 3.18's `rabbitmq-server` package is version 3.13.x as of this writing. The major version (3.13) matches what the source guide specifies; patch versions may differ.

### 3.4 Enable and start the service

```bash
sudo rc-update add rabbitmq-server default
sudo rc-service rabbitmq-server start
```

### 3.5 Enable the management plugin

```bash
sudo rabbitmq-plugins enable rabbitmq_management
sudo rc-service rabbitmq-server restart
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
