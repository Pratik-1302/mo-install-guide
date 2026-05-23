RabbitMQ is used by the IDP for internal messaging between microservices. It requires Erlang. Both are installed directly from the official RabbitMQ RPM releases on GitHub.

### 3.1 Install Erlang 26

```bash
sudo dnf install -y \
  https://github.com/rabbitmq/erlang-rpm/releases/download/v26.2.5.2/erlang-26.2.5.2-1.el8.x86_64.rpm \
  --nogpgcheck
```

> **Note.** The published Erlang RPM is built for `el8`, but installs cleanly on RHEL 9 because of compatible runtime dependencies. There is no current `el9`-tagged build from upstream.

### 3.2 Install RabbitMQ 3.13.7

```bash
sudo dnf install -y \
  https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7-1.el8.noarch.rpm \
  --nogpgcheck
```

### 3.3 Enable and start the service

```bash
sudo systemctl enable --now rabbitmq-server
sudo systemctl status rabbitmq-server
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

You should see a listener on `:5672` (AMQP) and `:15672` (management UI).

### Values for the `/initialize` wizard

| Field         | Value         |
|---------------|---------------|
| RabbitMQ Host | `127.0.0.1`   |
| AMQP Port     | `5672`        |
| Mgmt UI Port  | `15672`       |
| Default Login | `guest` / `guest` |
