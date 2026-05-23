The miniOrange installer bundles Java 17 and Redis. On Alpine, `mo-installer.sh` requires bash and several GNU coreutils, which you installed in Section 1.

### 4.1 Download the installer

```bash
cd /opt
sudo wget https://miniorange.s3.us-east-1.amazonaws.com/public/installers/mo-installer-5.0.0.zip
sudo unzip mo-installer-5.0.0.zip -d mo-installer-5.0.0
cd /opt/mo-installer-5.0.0
ls -la
```

### 4.2 Source the environment file

```bash
less .env.sh
source .env.sh
```

### 4.3 Set execute permissions

```bash
sudo chmod +x mo-installer.sh moctl/*.sh
```

### 4.4 Run the installer

```bash
sudo bash mo-installer.sh
```

> **Alpine note.** The installer may attempt to register systemd unit files. On Alpine those calls will fail silently and you'll need to write OpenRC init scripts for each microservice manually. Stub OpenRC files for `configserver`, `eurekaserver`, `gatekeeper`, and `miniorange` look like:

```bash
sudo tee /etc/init.d/mo-miniorange > /dev/null <<'OPENRC'
#!/sbin/openrc-run

name="miniorange"
description="miniOrange IDP main service"
command="/opt/tomcat/latest/bin/catalina.sh"
command_args="run"
command_user="root"
pidfile="/var/run/${RC_SVCNAME}.pid"
command_background=true
depend() {
    need net
    after rabbitmq-server redis
}
OPENRC

sudo chmod +x /etc/init.d/mo-miniorange
sudo rc-update add mo-miniorange default
```

Repeat for the other three microservices, adjusting paths and dependencies.

### 4.5 Start the four core services

If you authored OpenRC init scripts:

```bash
sudo rc-service mo-configserver start
sudo rc-service mo-eurekaserver start
sudo rc-service mo-gatekeeper start
sudo rc-service mo-miniorange start
```

`moctl service start` may also work if it's bash-portable; the source guide does not document Alpine specifically.

### 4.6 Open `/initialize` in a browser

```
https://<SERVER_IP>/initialize
```

Past the certificate warning, enter the values from the Database section above plus Redis (`127.0.0.1:6379`) and RabbitMQ.

### 4.7 Restart all services

```bash
sudo rc-service mo-miniorange restart
# (or the equivalent moctl call if it works on Alpine)
```
