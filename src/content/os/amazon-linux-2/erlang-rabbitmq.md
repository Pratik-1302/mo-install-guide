RabbitMQ requires Erlang. On Amazon Linux 2, install both from the official RabbitMQ RPM releases on GitHub, using the el7 builds.

### 3.1 Install Erlang 26 (el7 build)

```bash
sudo yum install -y \
  https://github.com/rabbitmq/erlang-rpm/releases/download/v26.2.5.2/erlang-26.2.5.2-1.el7.x86_64.rpm \
  --nogpgcheck
```

### 3.2 Install RabbitMQ 3.13.7 (el7 build)

```bash
sudo yum install -y \
  https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7-1.el7.noarch.rpm \
  --nogpgcheck
```

### 3.3 Enable and start the service

```bash
sudo systemctl enable --now rabbitmq-server
```

### 3.4 Enable the management plugin

```bash
sudo rabbitmq-plugins enable rabbitmq_management
sudo systemctl restart rabbitmq-server
```

### 3.5 Verify

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
